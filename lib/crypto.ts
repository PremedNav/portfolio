import crypto from 'crypto'

// ─── AES-256-GCM Encryption ──────────────────────────────────────────────────

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''

function getKeyBuffer(): Buffer {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-char hex string (32 bytes)')
  }
  return Buffer.from(ENCRYPTION_KEY, 'hex')
}

export function encrypt(plaintext: string): string {
  const key = getKeyBuffer()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Format: iv:authTag:ciphertext (all hex)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(token: string): string {
  const key = getKeyBuffer()
  const [ivHex, authTagHex, encryptedHex] = token.split(':')
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted token format')
  }
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

// ─── HMAC Hashing (for email dedup) ──────────────────────────────────────────

export function hmacHash(value: string): string {
  const key = getKeyBuffer()
  return crypto.createHmac('sha256', key).update(value).digest('hex')
}

// ─── PBKDF2 Password Verification ────────────────────────────────────────────

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = process.env.ADMIN_PASSWORD_HASH || ''
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) return reject(err)
      resolve(derivedKey.toString('hex') === hash)
    })
  })
}

// ─── HMAC Session Tokens ─────────────────────────────────────────────────────

const SESSION_SECRET = process.env.SESSION_SECRET || ''

export function createSessionToken(): string {
  const payload = `${Date.now()}:${crypto.randomBytes(16).toString('hex')}`
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string): boolean {
  if (!token || !SESSION_SECRET) return false
  const dotIndex = token.lastIndexOf('.')
  if (dotIndex === -1) return false

  const payload = token.substring(0, dotIndex)
  const sig = token.substring(dotIndex + 1)
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) {
    return false
  }

  // Check expiry (24 hours)
  const timestamp = parseInt(payload.split(':')[0], 10)
  const twentyFourHours = 24 * 60 * 60 * 1000
  return Date.now() - timestamp < twentyFourHours
}

// ─── Rate Limiter Factory ────────────────────────────────────────────────────

interface RateLimiterOptions {
  windowMs: number
  maxAttempts: number
}

const limiters = new Map<string, Map<string, number[]>>()

export function createRateLimiter(name: string, options: RateLimiterOptions) {
  if (!limiters.has(name)) {
    limiters.set(name, new Map())
  }
  const store = limiters.get(name)!

  return {
    isLimited(key: string): boolean {
      const now = Date.now()
      const attempts = (store.get(key) || []).filter((t) => now - t < options.windowMs)
      store.set(key, attempts)
      return attempts.length >= options.maxAttempts
    },
    record(key: string) {
      const attempts = store.get(key) || []
      attempts.push(Date.now())
      store.set(key, attempts)
    },
  }
}
