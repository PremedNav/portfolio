import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSessionToken, createRateLimiter } from '@/lib/crypto'

export const runtime = 'nodejs'

const loginLimiter = createRateLimiter('admin-login', {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    if (loginLimiter.isLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Try again in 15 minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required.' }, { status: 400 })
    }

    loginLimiter.record(ip)

    const valid = await verifyPassword(password)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const token = createSessionToken()
    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
