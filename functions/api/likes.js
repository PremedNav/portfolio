// Cloudflare Pages Function — real like persistence via KV
// GET /api/likes?slug=xxx → { count: N } (real likes only, base computed client-side)
// POST /api/likes { slug, action: 'like'|'unlike' } → { count: N }

export async function onRequestGet(context) {
  const url = new URL(context.request.url)
  const slug = url.searchParams.get('slug')

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const count = parseInt(await context.env.LIKES.get(slug) || '0', 10)
    return new Response(JSON.stringify({ count }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    // KV not bound — return 0 so site still works
    return new Response(JSON.stringify({ count: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function onRequestPost(context) {
  try {
    const { slug, action } = await context.request.json()

    if (!slug || !['like', 'unlike'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const current = parseInt(await context.env.LIKES.get(slug) || '0', 10)
    const updated = action === 'like'
      ? current + 1
      : Math.max(0, current - 1)

    await context.env.LIKES.put(slug, String(updated))

    return new Response(JSON.stringify({ count: updated }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
