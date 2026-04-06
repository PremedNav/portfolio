import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

function verifySessionToken(token: string): boolean {
  const secret = process.env.SESSION_SECRET
  if (!secret || !token) return false
  const [payload, hmac] = token.split('.')
  if (!payload || !hmac) return false

  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  try {
    if (!crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(hmac, 'hex'))) {
      return false
    }
  } catch {
    return false
  }

  const created = parseInt(payload, 10)
  if (isNaN(created)) return false
  return Date.now() - created < 24 * 60 * 60 * 1000
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    const subscribers = JSON.parse(data)
    return NextResponse.json({ subscribers })
  } catch {
    return NextResponse.json({ subscribers: [] })
  }
}
