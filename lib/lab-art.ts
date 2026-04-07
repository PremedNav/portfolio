// Deterministic lab art generation from slug + tags
// Same approach as blog-art.ts: FNV-1a hash → mulberry32 PRNG → unique gradients

function fnv1a(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

function hsla(h: number, s: number, l: number, a: number) {
  return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a.toFixed(2)})`
}

// Lab uses cooler, more technical palettes (blues, teals, violets)
const TAG_PALETTES: Record<string, { hueMin: number; hueMax: number; satMin: number; satMax: number }> = {
  WebGL:      { hueMin: 220, hueMax: 260, satMin: 12, satMax: 22 },
  'Three.js': { hueMin: 180, hueMax: 220, satMin: 10, satMax: 20 },
  GLSL:       { hueMin: 260, hueMax: 290, satMin: 12, satMax: 22 },
  Simulation: { hueMin: 200, hueMax: 240, satMin: 10, satMax: 18 },
  Interactive: { hueMin: 170, hueMax: 210, satMin: 10, satMax: 20 },
  '3D':       { hueMin: 190, hueMax: 230, satMin: 10, satMax: 18 },
  Particles:  { hueMin: 240, hueMax: 280, satMin: 12, satMax: 20 },
  Compute:    { hueMin: 210, hueMax: 250, satMin: 10, satMax: 18 },
}

const DEFAULT_PALETTE = { hueMin: 210, hueMax: 250, satMin: 10, satMax: 20 }

function getPalette(tag: string) {
  return TAG_PALETTES[tag] || DEFAULT_PALETTE
}

export function generateLabCardArt(slug: string, tags: string[]): string {
  const seed = fnv1a(slug)
  const rand = mulberry32(seed)
  const pal = getPalette(tags[0] || '')

  const hue = lerp(pal.hueMin, pal.hueMax, rand())
  const sat = lerp(pal.satMin, pal.satMax, rand())
  const angle = Math.round(lerp(125, 170, rand()))

  const c1 = hsl(hue, sat, lerp(75, 82, rand()))
  const c2 = hsl(hue + lerp(-4, 4, rand()), sat + 2, lerp(50, 58, rand()))
  const c3 = hsl(hue + lerp(-3, 3, rand()), sat, lerp(62, 70, rand()))
  const c4 = hsl(hue + lerp(-2, 2, rand()), sat - 1, lerp(76, 82, rand()))

  const rx = Math.round(lerp(20, 70, rand()))
  const ry = Math.round(lerp(20, 50, rand()))
  const blobColor = hsla(hue, sat + 3, lerp(68, 76, rand()), 0.5)

  return [
    `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 30%, ${c3} 60%, ${c4} 100%)`,
    `radial-gradient(ellipse at ${rx}% ${ry}%, ${blobColor} 0%, transparent 55%)`,
  ].join(', ')
}

export function generateLabHeroArt(slug: string, tags: string[]): string {
  const seed = fnv1a('hero:' + slug)
  const rand = mulberry32(seed)
  const pal = getPalette(tags[0] || '')

  const hue = lerp(pal.hueMin, pal.hueMax, rand())
  const sat = lerp(pal.satMin, pal.satMax, rand())

  const blobs = Array.from({ length: 3 }, () => {
    const bx = Math.round(lerp(20, 80, rand()))
    const by = Math.round(lerp(20, 80, rand()))
    const bl = lerp(55, 72, rand())
    const ba = parseFloat(lerp(0.35, 0.8, rand()).toFixed(2))
    const spread = Math.round(lerp(45, 65, rand()))
    return `radial-gradient(ellipse at ${bx}% ${by}%, ${hsla(hue + lerp(-5, 5, rand()), sat + 3, bl, ba)} 0%, transparent ${spread}%)`
  })

  const angle = Math.round(lerp(125, 170, rand()))
  const stops = [
    { pct: 0,   l: lerp(78, 84, rand()) },
    { pct: 20,  l: lerp(68, 74, rand()) },
    { pct: 45,  l: lerp(52, 60, rand()) },
    { pct: 65,  l: lerp(62, 70, rand()) },
    { pct: 85,  l: lerp(74, 80, rand()) },
    { pct: 100, l: lerp(80, 86, rand()) },
  ]
  const lg = `linear-gradient(${angle}deg, ${stops.map(s => `${hsl(hue + lerp(-3, 3, rand()), sat, s.l)} ${s.pct}%`).join(', ')})`

  return [...blobs, lg].join(', ')
}
