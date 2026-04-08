// Client-side deterministic base count generation
// Same algorithm as the old server-side route — produces identical numbers

const POSTS: Record<string, { date: string; weight: number }> = {
  'prompt-engineering':             { date: '2026-03-20', weight: 0.82 },
  'training-12b-model':            { date: '2026-03-05', weight: 0.70 },
  'building-medical-ai':           { date: '2026-03-28', weight: 0.65 },
  'llm-cost-optimization':         { date: '2026-03-15', weight: 0.50 },
  'eval-driven-development':       { date: '2026-03-10', weight: 0.38 },
  'medical-image-classification':  { date: '2026-02-05', weight: 0.45 },
  'biochemical-pathway-discovery': { date: '2026-02-28', weight: 0.22 },
  'phage-therapy-computational':   { date: '2026-01-28', weight: 0.15 },
  'building-premeder':             { date: '2026-02-20', weight: 0.55 },
  'premed-tech-stack':             { date: '2026-02-10', weight: 0.30 },
  'realtime-data-pipelines':       { date: '2026-01-20', weight: 0.35 },
  'designing-ml-language':         { date: '2026-02-15', weight: 0.18 },
  'eulers-identity':               { date: '2026-02-10', weight: 0.58 },
  'cantors-diagonal':              { date: '2026-03-01', weight: 0.40 },
  'unsolved-conjectures':          { date: '2026-01-15', weight: 0.42 },
  'godel-incompleteness':          { date: '2026-01-10', weight: 0.36 },
  'topology-medicine':             { date: '2026-01-05', weight: 0.20 },
  'basel-problem':                 { date: '2026-02-20', weight: 0.25 },
}

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

export function getBaseCount(slug: string): number {
  const post = POSTS[slug]
  if (!post) return 0

  const hash = slugHash(slug)
  const rng = seededRng(hash)

  const pubDate = new Date(post.date)
  const now = new Date()
  const daysOld = Math.max(1, Math.floor((now.getTime() - pubDate.getTime()) / 86400000))

  const viralRoll = rng()
  const isViral = viralRoll < 0.10
  const viralMultiplier = isViral ? 3 + rng() * 4 : 1

  const baseRate = 12 + post.weight * 55
  const growth = baseRate * Math.log(1 + daysOld * 0.15)

  const entropy = 0.80 + rng() * 0.40
  const bump = Math.floor(rng() * 8)

  const raw = (growth * entropy + bump) * viralMultiplier

  return Math.max(3 + Math.floor(rng() * 5), Math.round(raw))
}
