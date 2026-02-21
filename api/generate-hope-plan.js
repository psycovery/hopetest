// api/generate-hope-plan.js
// Hope Forward — Vercel serverless function
// Proxies Guided Hope Plan requests to Anthropic API server-side
// Your ANTHROPIC_API_KEY stays secret — never exposed to the browser

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile, goals, overallProgress } = req.body;
  if (!profile) {
    return res.status(400).json({ error: 'Missing profile data' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
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
    {
      "icon": "single emoji",
      "title": "Pillar title",
      "description": "1 sentence description",
      "actions": ["action 1", "action 2", "action 3"]
    }
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

Base the plan on their name, region, goals and progress. Be specific, compassionate, and grounded in Hope Theory (goals, pathways, agency). Return ONLY JSON. No preamble, no markdown backticks.`;

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
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[generate-hope-plan] Anthropic error:', err);
      let detail = 'AI service unavailable.';
      try { detail = JSON.parse(err)?.error?.message || detail; } catch {}
      return res.status(502).json({ error: detail });
    }

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(clean);

    return res.status(200).json({ plan });
  } catch (e) {
    console.error('[generate-hope-plan] Error:', e);
    return res.status(500).json({ error: 'Could not generate your plan. Please try again.' });
  }
}
