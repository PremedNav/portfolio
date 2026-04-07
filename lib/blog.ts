import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface PostMeta {
  title: string
  subtitle: string
  date: string
  readTime: string
  category: string
  author: string
  slug: string
  featured?: boolean
}

export interface Post {
  meta: PostMeta
  content: string
  toc: string[]
}

// ─── Paths ──────────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

// ─── Utilities ──────────────────────────────────────────────────────────────────

export function extractTOC(content: string): string[] {
  const matches = content.matchAll(/<Section\s+name="([^"]+)"/g)
  return Array.from(matches, (m) => m[1])
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(CONTENT_DIR)
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    meta: {
      title: data.title,
      subtitle: data.subtitle || '',
      date: data.date,
      readTime: data.readTime,
      category: data.category,
      author: data.author,
      slug,
      featured: data.featured || false,
    },
    content,
    toc: extractTOC(content),
  }
}

export function getAllPosts(): PostMeta[] {
  const slugs = getAllSlugs()
  const posts = slugs.map((slug) => {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(raw)

    return {
      title: data.title,
      subtitle: data.subtitle || '',
      date: data.date,
      readTime: data.readTime,
      category: data.category,
      author: data.author,
      slug,
      featured: data.featured || false,
    }
  })

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getCategoryCounts(posts: PostMeta[]): { name: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const p of posts) {
    counts[p.category] = (counts[p.category] || 0) + 1
  }

  return [
    { name: 'All', count: posts.length },
    ...Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count })),
  ]
}
