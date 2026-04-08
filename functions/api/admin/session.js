// Cloudflare Pages Function — session check + logout

export async function onRequestGet(context) {
  const token = getSessionToken(context.request)
  if (!token) return json({ authenticated: false })

  const val = await context.env.LIKES.get(`session:${token}`)
  return json({ authenticated: val === 'valid' })
}

export async function onRequestDelete(context) {
  const token = getSessionToken(context.request)
  if (token) {
    await context.env.LIKES.delete(`session:${token}`)
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=0',
    },
  })
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
