// api/suggest-goals.js
// Hope Forward — Vercel serverless function
// Proxies Goal Suggester requests to Anthropic API server-side
// Your ANTHROPIC_API_KEY stays secret — never exposed to the browser

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;
  if (!input || typeof input !== 'string' || !input.trim()) {
    return res.status(400).json({ error: 'Missing input' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const systemPrompt = `You are a compassionate goal-setting coach for Hope Forward, an app supporting people rebuilding their lives after the criminal justice system in the UK. You help users turn vague aspirations into concrete, actionable goals grounded in Hope Theory (goals, pathways, agency).

When a user describes something they want to achieve, respond ONLY with a JSON array of exactly 3 goal suggestions. Each suggestion must have:
- "title": a clear, positive, first-person goal statement (e.g. "Find stable housing I'm proud of")
- "category": one of: "Probation & Supervision", "Housing", "Employment", "Education", "Family", "Health", "Finance", "Identity"
- "steps": array of exactly 3 concrete, practical action steps written in first person
- "why": one short sentence explaining how this goal helps them move forward
- "emoji": a single relevant emoji

Respond ONLY with valid JSON. No preamble, no markdown, no explanation. Just the JSON array.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Here's what I want to achieve: "${input.trim()}"` }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[suggest-goals] Anthropic error:', err);
      let detail = 'AI service unavailable.';
      try { detail = JSON.parse(err)?.error?.message || detail; } catch {}
      return res.status(502).json({ error: detail });
    }

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json({ suggestions: parsed });
  } catch (e) {
    console.error('[suggest-goals] Error:', e);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
