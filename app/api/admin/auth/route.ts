import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

// Rate limiting: 5 failed attempts per IP per 15 min
const failMap = new Map<string, number[]>()

function isLoginRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = 15 * 60 * 1000
  const attempts = (failMap.get(ip) || []).filter((t) => now - t < window)
  failMap.set(ip, attempts)
  return attempts.length >= 5
}

function recordFailedAttempt(ip: string) {
  const attempts = failMap.get(ip) || []
  attempts.push(Date.now())
  failMap.set(ip, attempts)
}

function verifyPassword(password: string): boolean {
  const stored = process.env.ADMIN_PASSWORD_HASH
  if (!stored) return false
  const [salt, hash] = stored.split(':')
  const derived = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(hash, 'hex'))
}

function createSessionToken(): string {
  const secret = process.env.SESSION_SECRET!
  const payload = Date.now().toString()
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${hmac}`
}

function verifySessionToken(token: string): boolean {
  const secret = process.env.SESSION_SECRET
  if (!secret || !token) return false
  const [payload, hmac] = token.split('.')
  if (!payload || !hmac) return false

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  if (!crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(hmac, 'hex'))) {
    return false
  }

  // Check 24h expiry
  const created = parseInt(payload, 10)
  if (isNaN(created)) return false
  return Date.now() - created < 24 * 60 * 60 * 1000
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  if (isLoginRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again in 15 minutes.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const password = body.password || ''

    if (!verifyPassword(password)) {
      recordFailedAttempt(ip)
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const token = createSessionToken()
    const isProduction = process.env.NODE_ENV === 'production'

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: isProduction,
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  const valid = token ? verifySessionToken(token) : false
  return NextResponse.json({ authenticated: valid })
}
