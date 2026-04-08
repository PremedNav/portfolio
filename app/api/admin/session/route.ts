import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/crypto'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value
  const authenticated = token ? verifySessionToken(token) : false
  return NextResponse.json({ authenticated })
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
