// Cloudflare Pages Function — admin login
// Uses ADMIN_PASSWORD env var + KV for session storage

export async function onRequestPost(context) {
  try {
    const { password } = await context.request.json()
    const adminPassword = context.env.ADMIN_PASSWORD

    if (!adminPassword || !password) {
      return json({ error: 'Invalid credentials.' }, 401)
    }

    // Constant-time comparison
    const encoder = new TextEncoder()
    const a = encoder.encode(password)
    const b = encoder.encode(adminPassword)

    let match = a.byteLength === b.byteLength
    const len = Math.max(a.byteLength, b.byteLength)
    const padA = new Uint8Array(len)
    const padB = new Uint8Array(len)
    padA.set(a)
    padB.set(b)
    for (let i = 0; i < len; i++) {
      if (padA[i] !== padB[i]) match = false
    }

    if (!match) {
      return json({ error: 'Incorrect password.' }, 401)
    }

    // Create session token
    const token = crypto.randomUUID() + '-' + crypto.randomUUID()
    await context.env.LIKES.put(`session:${token}`, 'valid', { expirationTtl: 86400 })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `admin_session=${token}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=86400`,
      },
    })
  } catch {
    return json({ error: 'Something went wrong.' }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
