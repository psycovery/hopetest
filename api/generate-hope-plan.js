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
  if (!profile) return res.status(400).json({ error: 'Missing profile data' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const goalsSummary = goals?.length
    ? goals.map(g => `${g.title} (${g.category}, ${g.agency}% complete)`).join('; ')
    : 'No goals set yet';

  const systemPrompt = `You are a specialist Hope Theory coach at Psycovery, creating a personalised Guided Hope Plan for someone rebuilding their life after the criminal justice system in the UK.

Create a structured, warm, and actionable Hope Plan. Respond ONLY with a valid JSON object with this structure:
{
  "headline": "A short personal motivational tagline (max 12 words)",
  "hopeScore": number between 0-100,
  "summary": "2-3 sentence warm honest summary",
  "pillars": [{ "icon": "emoji", "title": "title", "description": "1 sentence", "actions": ["action 1","action 2","action 3"] }],
  "weeklyPlan": [
    { "week": 1, "focus": "theme", "tasks": ["task 1","task 2","task 3"] },
    { "week": 2, "focus": "theme", "tasks": ["task 1","task 2","task 3"] },
    { "week": 3, "focus": "theme", "tasks": ["task 1","task 2","task 3"] },
    { "week": 4, "focus": "theme", "tasks": ["task 1","task 2","task 3"] }
  ],
  "affirmation": "A single powerful affirmation",
  "barriers": [{ "barrier": "name", "strategy": "how to overcome" }]
}
Return ONLY JSON. No preamble, no markdown backticks.`;

  const userMsg = `Name: ${profile.preferredName || profile.firstName || 'Friend'}
Region: ${profile.region || 'UK'}
${profile.prison ? `Released from: ${profile.prison}` : ''}
Goals: ${goalsSummary}
Hope score: ${overallProgress || 0}%`;

  let responseText = '';

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

    responseText = await response.text();
    console.log('[generate-hope-plan] HTTP status:', response.status);
    console.log('[generate-hope-plan] Raw response:', responseText.slice(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      return res.status(502).json({ error: 'Invalid response from AI: ' + responseText.slice(0, 200) });
    }

    if (!response.ok || data.type === 'error') {
      const msg = data?.error?.message || JSON.stringify(data).slice(0, 200);
      console.error('[generate-hope-plan] Anthropic error:', msg);
      return res.status(502).json({ error: msg });
    }

    const text = (data.content || []).map(b => b.text || '').join('').trim();

    if (!text) {
      return res.status(502).json({ error: 'Empty response from AI. Please try again.' });
    }

    let plan;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      plan = JSON.parse(clean);
    } catch (jsonErr) {
      return res.status(502).json({ error: 'Could not parse AI response. Please try again.' });
    }

    return res.status(200).json({ plan });

  } catch (e) {
    console.error('[generate-hope-plan] Fatal error:', e.message, '| Raw:', responseText.slice(0, 300));
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
};
