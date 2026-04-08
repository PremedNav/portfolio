import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken, decrypt, encrypt, hmacHash } from '@/lib/crypto'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

interface LegacySubscriber {
  email: string
  date: string
}

interface EncryptedSubscriber {
  encryptedEmail: string
  emailHash: string
  subscribedAt: string
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value
  return token ? verifySessionToken(token) : false
}

function readRaw(): unknown[] {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeSubscribers(data: EncryptedSubscriber[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// Migrate plaintext entries to encrypted format
function migrateIfNeeded(raw: unknown[]): EncryptedSubscriber[] {
  let needsMigration = false
  const migrated: EncryptedSubscriber[] = []

  for (const entry of raw) {
    const rec = entry as Record<string, unknown>
    if (rec.encryptedEmail && rec.emailHash) {
      migrated.push(rec as unknown as EncryptedSubscriber)
    } else if (rec.email && typeof rec.email === 'string') {
      // Legacy plaintext entry — migrate it
      needsMigration = true
      const email = rec.email as string
      migrated.push({
        encryptedEmail: encrypt(email),
        emailHash: hmacHash(email),
        subscribedAt: (rec.date as string) || new Date().toISOString(),
      })
    }
  }

  if (needsMigration) {
    writeSubscribers(migrated)
  }

  return migrated
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const raw = readRaw()
    const subscribers = migrateIfNeeded(raw)

    const decrypted = subscribers.map((s) => {
      try {
        return { email: decrypt(s.encryptedEmail), subscribedAt: s.subscribedAt }
      } catch {
        return { email: '[decryption error]', subscribedAt: s.subscribedAt }
      }
    })

    return NextResponse.json({ subscribers: decrypted, total: decrypted.length })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const index = parseInt(searchParams.get('index') || '', 10)

    const raw = readRaw()
    const subscribers = migrateIfNeeded(raw)

    if (isNaN(index) || index < 0 || index >= subscribers.length) {
      return NextResponse.json({ error: 'Invalid index.' }, { status: 400 })
    }

    subscribers.splice(index, 1)
    writeSubscribers(subscribers)

    return NextResponse.json({ success: true, remaining: subscribers.length })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
