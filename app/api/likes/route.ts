import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

const DATA_FILE = path.join(process.cwd(), 'data', 'likes.json')

// ─── Post metadata for realistic like generation ─────────────────────────────
// date: publication date, weight: topic popularity (0-1 scale)
// Higher weight = broader appeal = more likes. Most posts are 0.3-0.6 range.
const POSTS: Record<string, { date: string; weight: number }> = {
  // AI/LLM — trendy, broad dev audience
  'prompt-engineering':             { date: '2026-03-20', weight: 0.82 },
  'training-12b-model':            { date: '2026-03-05', weight: 0.70 },
  'building-medical-ai':           { date: '2026-03-28', weight: 0.65 },
  'llm-cost-optimization':         { date: '2026-03-15', weight: 0.50 },
  'eval-driven-development':       { date: '2026-03-10', weight: 0.38 },
  // Medical / Bio — niche but passionate audience
  'medical-image-classification':  { date: '2026-02-05', weight: 0.45 },
  'biochemical-pathway-discovery': { date: '2026-02-28', weight: 0.22 },
  'phage-therapy-computational':   { date: '2026-01-28', weight: 0.15 },
  // Personal / Community — relatable stories
  'building-premeder':             { date: '2026-02-20', weight: 0.55 },
  'premed-tech-stack':             { date: '2026-02-10', weight: 0.30 },
  // Engineering
  'realtime-data-pipelines':       { date: '2026-01-20', weight: 0.35 },
  'designing-ml-language':         { date: '2026-02-15', weight: 0.18 },
  // Math — varies: some topics have broad appeal, others very niche
  'eulers-identity':               { date: '2026-02-10', weight: 0.58 },
  'cantors-diagonal':              { date: '2026-03-01', weight: 0.40 },
  'unsolved-conjectures':          { date: '2026-01-15', weight: 0.42 },
  'godel-incompleteness':          { date: '2026-01-10', weight: 0.36 },
  'topology-medicine':             { date: '2026-01-05', weight: 0.20 },
  'basel-problem':                 { date: '2026-02-20', weight: 0.25 },
}

// Deterministic seeded PRNG (mulberry32) — same slug always produces same numbers
function seededRng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function slugHash(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = ((h << 5) - h + slug.charCodeAt(i)) | 0
  return Math.abs(h)
}

function getBaseCount(slug: string): number {
  const post = POSTS[slug]
  if (!post) return 0

  const hash = slugHash(slug)
  const rng = seededRng(hash)

  const pubDate = new Date(post.date)
  const now = new Date()
  const daysOld = Math.max(1, Math.floor((now.getTime() - pubDate.getTime()) / 86400000))

  // ── Virality: ~10% chance a post "goes viral" (3-7x multiplier) ────────
  const viralRoll = rng()
  const isViral = viralRoll < 0.10
  const viralMultiplier = isViral ? 3 + rng() * 4 : 1

  // ── Base growth: logarithmic with topic weight ─────────────────────────
  // Realistic for a personal/technical blog: most posts get 10-120 likes
  // Likes accumulate fast in first week, then slow dramatically
  const baseRate = 12 + post.weight * 55 // 12-67 likes per "log unit"
  const growth = baseRate * Math.log(1 + daysOld * 0.15)

  // ── Entropy: ±20% seeded variation so numbers aren't smooth ────────────
  const entropy = 0.80 + rng() * 0.40 // 0.80 to 1.20

  // ── Small random bump: simulates sporadic shares / link referrals ──────
  const bump = Math.floor(rng() * 8)

  // ── Combine ────────────────────────────────────────────────────────────
  const raw = (growth * entropy + bump) * viralMultiplier

  // Floor: even unpopular posts get a handful of likes (author's friends)
  return Math.max(3 + Math.floor(rng() * 5), Math.round(raw))
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
