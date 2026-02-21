// api/generate-hope-plan.js
// Hope Forward — Vercel serverless function (CommonJS)
// Psycovery

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { profile, goals, overallProgress } = req.body || {};
  if (!profile) {
    return res.status(400).json({ error: 'Missing profile data' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('[generate-hope-plan] ANTHROPIC_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error — API key missing' });
  }

  const goalsSummary = goals?.length
    ? goals.map(g => `${g.title} (${g.category}, ${g.agency}% complete)`).join('; ')
    : 'No goals set yet';

  const systemPrompt = `You are a specialist Hope Theory coach at Psycovery, creating a personalised Guided Hope Plan for someone rebuilding their life after the criminal justice system in the UK.

Create a structured, warm, and actionable Hope Plan. Respond ONLY with a valid JSON object with this structure:
{
  "headline": "A short personal motivational tagline (max 12 words)",
  "hopeScore": number (0-100, based on goals progress),
  "summary": "2-3 sentences: a warm, honest summary of where this person is and what their plan will help them achieve",
  "pillars": [
    { "icon": "single emoji", "title": "Pillar title", "description": "1 sentence description", "actions": ["action 1", "action 2", "action 3"] }
  ],
  "weeklyPlan": [
    { "week": 1, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": 2, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": 3, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] },
    { "week": 4, "focus": "theme", "tasks": ["task 1", "task 2", "task 3"] }
  ],
  "affirmation": "A single powerful personal affirmation sentence",
  "barriers": [
    { "barrier": "likely barrier name", "strategy": "how to overcome it" },
    { "barrier": "likely barrier name", "strategy": "how to overcome it" },
    { "barrier": "likely barrier name", "strategy": "how to overcome it" }
  ]
}

Return ONLY JSON. No preamble, no markdown backticks.`;

  const userMsg = `Name: ${profile.preferredName || profile.firstName || 'Friend'}
Region: ${profile.region || 'UK'}
${profile.prison ? `Released from: ${profile.prison}` : ''}
Current goals: ${goalsSummary}
Overall hope score: ${overallProgress || 0}%

Please create my personalised Guided Hope Plan.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('[generate-hope-plan] Anthropic error:', responseText);
      let detail = 'AI service error';
      try { detail = JSON.parse(responseText)?.error?.message || detail; } catch {}
      return res.status(502).json({ error: detail });
    }

    const data = JSON.parse(responseText);
    const text = (data.content || []).map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(clean);

    return res.status(200).json({ plan });

  } catch (e) {
    console.error('[generate-hope-plan] Unexpected error:', e.message);
    return res.status(500).json({ error: e.message || 'Unexpected error. Please try again.' });
  }
};
