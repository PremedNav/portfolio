// Cloudflare Pages Function — view/delete contact form messages from KV

export async function onRequestGet(context) {
  const token = getSessionToken(context.request)
  if (!token) return json({ error: 'Unauthorized' }, 401)
  const session = await context.env.LIKES.get(`session:${token}`)
  if (session !== 'valid') return json({ error: 'Unauthorized' }, 401)

  try {
    const list = await context.env.LIKES.list({ prefix: 'contact:' })
    const messages = []

    for (const key of list.keys) {
      const data = await context.env.LIKES.get(key.name)
      if (data) {
        const parsed = JSON.parse(data)
        messages.push({
          key: key.name,
          name: parsed.name || '',
          email: parsed.email || '',
          organization: parsed.organization || '',
          subject: parsed.subject || '',
          message: parsed.message || '',
          submittedAt: parsed.submittedAt || '',
        })
      }
    }

    // Sort newest first
    messages.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

    return json({ messages, total: messages.length })
  } catch {
    return json({ messages: [], total: 0 })
  }
}

export async function onRequestDelete(context) {
  const token = getSessionToken(context.request)
  if (!token) return json({ error: 'Unauthorized' }, 401)
  const session = await context.env.LIKES.get(`session:${token}`)
  if (session !== 'valid') return json({ error: 'Unauthorized' }, 401)

  try {
    const url = new URL(context.request.url)
    const key = url.searchParams.get('key')
    if (!key || !key.startsWith('contact:')) {
      return json({ error: 'Invalid key' }, 400)
    }
    await context.env.LIKES.delete(key)
    return json({ success: true })
  } catch {
    return json({ error: 'Failed to delete message' }, 500)
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
