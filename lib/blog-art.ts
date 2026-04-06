// Deterministic blog art generation from slug + category
// FNV-1a hash → mulberry32 PRNG → unique gradients per post

// ─── Hash + PRNG ────────────────────────────────────────────────────────────────

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

// ─── Category Palettes (HSL ranges) ────────────────────────────────────────────

type Palette = { hueMin: number; hueMax: number; satMin: number; satMax: number }

const PALETTES: Record<string, Palette> = {
  Research:       { hueMin: 30, hueMax: 50, satMin: 10, satMax: 20 },
  Tips:           { hueMin: 35, hueMax: 55, satMin: 12, satMax: 22 },
  Tutorials:      { hueMin: 25, hueMax: 45, satMin: 8,  satMax: 18 },
  'Case Studies': { hueMin: 38, hueMax: 52, satMin: 10, satMax: 18 },
  Product:        { hueMin: 28, hueMax: 48, satMin: 10, satMax: 20 },
}

const DEFAULT_PALETTE: Palette = { hueMin: 30, hueMax: 50, satMin: 10, satMax: 20 }

function getPalette(category: string): Palette {
  return PALETTES[category] || DEFAULT_PALETTE
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`
}

function hsla(h: number, s: number, l: number, a: number) {
  return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${a.toFixed(2)})`
}

// ─── Exported Generators ────────────────────────────────────────────────────────

export function generateCardArt(slug: string, category: string): string {
  const seed = fnv1a(slug)
  const rand = mulberry32(seed)
  const pal = getPalette(category)

  const hue = lerp(pal.hueMin, pal.hueMax, rand())
  const sat = lerp(pal.satMin, pal.satMax, rand())
  const angle = Math.round(lerp(125, 170, rand()))

  // 4 color stops: light → dark accent → mid → light
  const c1 = hsl(hue, sat, lerp(75, 82, rand()))
  const c2 = hsl(hue + lerp(-4, 4, rand()), sat + 2, lerp(50, 58, rand()))
  const c3 = hsl(hue + lerp(-3, 3, rand()), sat, lerp(62, 70, rand()))
  const c4 = hsl(hue + lerp(-2, 2, rand()), sat - 1, lerp(76, 82, rand()))

  // Radial blob
  const rx = Math.round(lerp(20, 70, rand()))
  const ry = Math.round(lerp(20, 50, rand()))
  const blobColor = hsla(hue, sat + 3, lerp(68, 76, rand()), 0.5)

  return [
    `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 30%, ${c3} 60%, ${c4} 100%)`,
    `radial-gradient(ellipse at ${rx}% ${ry}%, ${blobColor} 0%, transparent 55%)`,
  ].join(', ')
}

export function generateHeroArt(slug: string, category: string): string {
  const seed = fnv1a('hero:' + slug)
  const rand = mulberry32(seed)
  const pal = getPalette(category)

  const hue = lerp(pal.hueMin, pal.hueMax, rand())
  const sat = lerp(pal.satMin, pal.satMax, rand())

  // 3 radial blobs
  const blobs = Array.from({ length: 3 }, () => {
    const bx = Math.round(lerp(20, 80, rand()))
    const by = Math.round(lerp(20, 80, rand()))
    const bl = lerp(55, 72, rand())
    const ba = parseFloat(lerp(0.35, 0.8, rand()).toFixed(2))
    const spread = Math.round(lerp(45, 65, rand()))
    return `radial-gradient(ellipse at ${bx}% ${by}%, ${hsla(hue + lerp(-5, 5, rand()), sat + 3, bl, ba)} 0%, transparent ${spread}%)`
  })

  // Linear gradient with 6 stops
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

  // Radials first (matching existing FEATURED_ART convention)
  return [...blobs, lg].join(', ')
}
