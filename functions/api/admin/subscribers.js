// Cloudflare Pages Function — view subscribers from KV

export async function onRequestGet(context) {
  // Auth check
  const token = getSessionToken(context.request)
  if (!token) return json({ error: 'Unauthorized' }, 401)
  const session = await context.env.LIKES.get(`session:${token}`)
  if (session !== 'valid') return json({ error: 'Unauthorized' }, 401)

  try {
    const list = await context.env.LIKES.list({ prefix: 'subscriber:' })
    const subscribers = []

    for (const key of list.keys) {
      const data = await context.env.LIKES.get(key.name)
      if (data) {
        const parsed = JSON.parse(data)
        subscribers.push({
          email: key.name.replace('subscriber:', '').slice(0, 8) + '...',
          subscribedAt: parsed.subscribedAt || '',
        })
      }
    }

    return json({ subscribers, total: subscribers.length })
  } catch {
    return json({ subscribers: [], total: 0 })
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
