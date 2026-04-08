// Cloudflare Pages Function — contact form submissions via KV

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function onRequestPost(context) {
  try {
    const ip = context.request.headers.get('cf-connecting-ip') || 'unknown'

    // Rate limit: 3 submissions per IP per hour
    const rateLimitKey = `ratelimit:contact:${ip}`
    const attempts = JSON.parse(await context.env.LIKES.get(rateLimitKey) || '[]')
    const now = Date.now()
    const recentAttempts = attempts.filter((t) => now - t < 3600000)
    if (recentAttempts.length >= 3) {
      return new Response(JSON.stringify({ error: 'Too many messages. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { name: rawName, email: rawEmail, organization: rawOrg, subject: rawSubject, message: rawMessage } = await context.request.json()
    const name = (rawName || '').trim()
    const email = (rawEmail || '').trim().toLowerCase()
    const organization = (rawOrg || '').trim()
    const subject = (rawSubject || '').trim()
    const message = (rawMessage || '').trim()

    // Validate name
    if (!name || name.length > 200) {
      return new Response(JSON.stringify({ error: 'Please enter a valid name (max 200 characters).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate email
    if (!email || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate organization (optional, but cap length)
    if (organization.length > 200) {
      return new Response(JSON.stringify({ error: 'Organization name is too long (max 200 characters).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate subject
    if (!subject || subject.length > 200) {
      return new Response(JSON.stringify({ error: 'Please enter a subject (max 200 characters).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Validate message
    if (!message || message.length > 5000) {
      return new Response(JSON.stringify({ error: 'Please enter a message (max 5000 characters).' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Hash IP for the storage key
    const ipHash = await hashString(ip)

    // Store contact message
    const key = `contact:${now}:${ipHash}`
    await context.env.LIKES.put(key, JSON.stringify({
      name,
      email,
      organization,
      subject,
      message,
      submittedAt: new Date().toISOString(),
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

async function hashString(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}
