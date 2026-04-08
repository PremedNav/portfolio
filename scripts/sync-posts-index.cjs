// Reads all blog post MDX frontmatter and uploads the index to KV
// Run after build: node scripts/sync-posts-index.js

const fs = require('fs')
const path = require('path')

const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog')

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let val = line.slice(colon + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    fm[key] = val
  }
  return fm
}

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'))
const posts = files.map(f => {
  const content = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8')
  const fm = extractFrontmatter(content)
  return {
    slug: f.replace('.mdx', ''),
    title: fm.title || f.replace('.mdx', ''),
    date: fm.date || null,
  }
}).sort((a, b) => (b.date || '').localeCompare(a.date || ''))

console.log(JSON.stringify(posts, null, 2))
