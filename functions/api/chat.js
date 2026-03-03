const WINDOW_MS = 60 * 1000;
const MAX_PER_MINUTE = 5;
const DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_DAY = 50;

const rateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { hits: [], dailyHits: [] });
  }
  const entry = rateLimit.get(ip);
  entry.hits = entry.hits.filter((t) => now - t < WINDOW_MS);
  entry.dailyHits = entry.dailyHits.filter((t) => now - t < DAILY_WINDOW_MS);

  if (entry.hits.length >= MAX_PER_MINUTE) {
    return 'Slow down — max 5 messages per minute. Try again shortly.';
  }
  if (entry.dailyHits.length >= MAX_PER_DAY) {
    return "You've reached the daily limit (50 messages). Come back tomorrow!";
  }

  entry.hits.push(now);
  entry.dailyHits.push(now);
  return null;
}

const SYSTEM_PROMPT = `You are Clover, a chill AI assistant on Navtej Singh's portfolio site. Talk like a real person — casual, witty, and brief. Never be robotic or overly formal. Don't over-explain or lecture.

If someone compliments Navtej or says something hype, match their energy. If they joke around, joke back. If they ask a real question, answer it straight.

What you know about Navtej:
- Full-stack developer who loves building cool web experiences
- Built this site with Next.js, GSAP animations, and Tailwind
- Into AI, gaming, and creative tech
- Based in Colorado

Rules:
- 1-2 sentences max. Be punchy.
- Never start with "Great question" or "That's a great point"
- Don't narrate what you're doing ("Let me tell you about...")
- Just talk naturally like a friend would`;

export async function onRequestPost(context) {
  const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
  const limited = checkRateLimit(ip);
  if (limited) {
    return new Response(JSON.stringify({ reply: limited }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await context.request.json();
    const recentMessages = messages.slice(-10);

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentMessages.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      })),
    ];

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: chatMessages,
        max_tokens: 256,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ reply: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
