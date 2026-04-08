// Cloudflare Pages Function — announcement management via KV
// GET: public (AnnouncementBar fetches this)
// PUT: admin-only (update announcement)

const KV_KEY = 'announcement'

export async function onRequestGet(context) {
  try {
    const data = await context.env.LIKES.get(KV_KEY)
    if (!data) {
      return json(null)
    }
    return json(JSON.parse(data))
  } catch {
    return json(null)
  }
}

export async function onRequestPut(context) {
  // Auth check
  const token = getSessionToken(context.request)
  if (!token) return json({ error: 'Unauthorized' }, 401)
  const session = await context.env.LIKES.get(`session:${token}`)
  if (session !== 'valid') return json({ error: 'Unauthorized' }, 401)

  try {
    const body = await context.request.json()
    await context.env.LIKES.put(KV_KEY, JSON.stringify(body))
    return json({ success: true })
  } catch {
    return json({ error: 'Something went wrong.' }, 500)
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
