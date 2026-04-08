// Cloudflare Pages Function — newsletter signups via KV

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function onRequestPost(context) {
  try {
    const ip = context.request.headers.get('cf-connecting-ip') || 'unknown'

    // Rate limit check via KV
    const rateLimitKey = `ratelimit:${ip}`
    const attempts = JSON.parse(await context.env.LIKES.get(rateLimitKey) || '[]')
    const now = Date.now()
    const recentAttempts = attempts.filter((t) => now - t < 3600000) // 1 hour
    if (recentAttempts.length >= 3) {
      return new Response(JSON.stringify({ error: 'Too many signups. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { email: rawEmail } = await context.request.json()
    const email = (rawEmail || '').trim().toLowerCase()

    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Simple hash for dedup (not crypto-grade, just for dedup)
    const emailHash = await hashEmail(email)
    const dedupKey = `subscriber:${emailHash}`
    const existing = await context.env.LIKES.get(dedupKey)

    if (existing) {
      return new Response(JSON.stringify({ error: 'This email is already subscribed.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Store subscriber
    await context.env.LIKES.put(dedupKey, JSON.stringify({
      subscribedAt: new Date().toISOString(),
    }))

    // Update rate limit
    recentAttempts.push(now)
    await context.env.LIKES.put(rateLimitKey, JSON.stringify(recentAttempts), {
      expirationTtl: 3600,
    })

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function hashEmail(email) {
  const encoder = new TextEncoder()
  const data = encoder.encode(email)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}
