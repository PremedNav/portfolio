import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/crypto'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'announcement.json')

interface Announcement {
  id: string
  text: string
  link: string
  linkLabel: string
  active: boolean
  color: string
}

function readAnnouncement(): Announcement | null {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return null
  }
}

function writeAnnouncement(data: Announcement) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value
  return token ? verifySessionToken(token) : false
}

// Public GET — the AnnouncementBar fetches this
export async function GET() {
  const announcement = readAnnouncement()
  if (!announcement || !announcement.active) {
    return NextResponse.json(null)
  }
  return NextResponse.json(announcement)
}

// Protected PUT — admin updates announcement
export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, text, link, linkLabel, active, color } = body

    if (!id || !text) {
      return NextResponse.json({ error: 'id and text are required.' }, { status: 400 })
    }

    const announcement: Announcement = {
      id: String(id),
      text: String(text),
      link: String(link || ''),
      linkLabel: String(linkLabel || ''),
      active: Boolean(active),
      color: String(color || 'midnight'),
    }

    writeAnnouncement(announcement)
    return NextResponse.json({ success: true, announcement })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
