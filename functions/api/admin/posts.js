// Cloudflare Pages Function — list blog posts (static metadata)
// Since we can't read the filesystem in Workers, this is populated at build time
// via the generate-posts-index script, stored in KV

export async function onRequestGet(context) {
  // Auth check
  const token = getSessionToken(context.request)
  if (!token) return json({ error: 'Unauthorized' }, 401)
  const session = await context.env.LIKES.get(`session:${token}`)
  if (session !== 'valid') return json({ error: 'Unauthorized' }, 401)

  try {
    const data = await context.env.LIKES.get('posts-index')
    if (data) {
      return json({ posts: JSON.parse(data) })
    }

    // Fallback: return empty
    return json({ posts: [] })
  } catch {
    return json({ posts: [] })
  }
}

function getSessionToken(request) {
  const cookie = request.headers.get('Cookie') || ''
  const match = cookie.match(/admin_session=([^;]+)/)
  return match ? match[1] : null
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
