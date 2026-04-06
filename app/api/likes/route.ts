import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'likes.json')

// Post publication dates for base count calculation
const POST_DATES: Record<string, string> = {
  'building-medical-ai': 'March 28, 2026',
  'prompt-engineering': 'March 20, 2026',
  'llm-cost-optimization': 'March 15, 2026',
  'eval-driven-development': 'March 10, 2026',
  'training-12b-model': 'March 5, 2026',
  'biochemical-pathway-discovery': 'February 28, 2026',
  'building-premeder': 'February 20, 2026',
  'designing-ml-language': 'February 15, 2026',
  'premed-tech-stack': 'February 10, 2026',
  'medical-image-classification': 'February 5, 2026',
  'phage-therapy-computational': 'January 28, 2026',
  'realtime-data-pipelines': 'January 20, 2026',
}

function getBaseCount(slug: string): number {
  const dateStr = POST_DATES[slug]
  if (!dateStr) return 0

  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash + slug.charCodeAt(i)) | 0
  }
  hash = Math.abs(hash)

  const pubDate = new Date(dateStr)
  const now = new Date()
  const daysOld = Math.max(1, Math.floor((now.getTime() - pubDate.getTime()) / 86400000))
  const variance = (hash % 40) / 100 + 0.8
  return Math.round((daysOld * 8 + Math.sqrt(daysOld) * 25) * variance)
}

function readLikes(): Record<string, number> {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function writeLikes(likes: Record<string, number>) {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(likes, null, 2))
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const likes = readLikes()
  const realLikes = likes[slug] || 0
  const baseCount = getBaseCount(slug)

  return NextResponse.json({ count: baseCount + realLikes })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, action } = body

    if (!slug || !['like', 'unlike'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const likes = readLikes()
    const current = likes[slug] || 0

    if (action === 'like') {
      likes[slug] = current + 1
    } else {
      likes[slug] = Math.max(0, current - 1)
    }

    writeLikes(likes)

    const baseCount = getBaseCount(slug)
    return NextResponse.json({ count: baseCount + likes[slug] })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
