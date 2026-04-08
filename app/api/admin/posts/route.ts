import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/crypto'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const runtime = 'nodejs'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get('admin_session')?.value
  return token ? verifySessionToken(token) : false
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

    const posts = files.map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
      const { data } = matter(content)
      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
      }
    })

    // Sort by date descending
    posts.sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json({ posts, total: posts.length })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
