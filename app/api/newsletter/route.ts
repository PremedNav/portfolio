import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { encrypt, hmacHash } from '@/lib/crypto'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

// Rate limiting: 3 signups per IP per hour
const rateMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hour = 60 * 60 * 1000
  const attempts = (rateMap.get(ip) || []).filter((t) => now - t < hour)
  rateMap.set(ip, attempts)
  return attempts.length >= 3
}

function recordAttempt(ip: string) {
  const attempts = rateMap.get(ip) || []
  attempts.push(Date.now())
  rateMap.set(ip, attempts)
}

interface EncryptedSubscriber {
  encryptedEmail: string
  emailHash: string
  subscribedAt: string
}

function readSubscribers(): EncryptedSubscriber[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeSubscribers(subscribers: EncryptedSubscriber[]) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(subscribers, null, 2))
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many signups. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const email = (body.email || '').trim().toLowerCase()

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const subscribers = readSubscribers()
    const emailHash = hmacHash(email)

    // Dedup check using HMAC hash (can't compare encrypted values)
    if (subscribers.some((s) => s.emailHash === emailHash)) {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 409 }
      )
    }

    subscribers.push({
      encryptedEmail: encrypt(email),
      emailHash,
      subscribedAt: new Date().toISOString(),
    })
    writeSubscribers(subscribers)
    recordAttempt(ip)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
