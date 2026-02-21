// api/suggest-goals.js
// Hope Forward — Vercel serverless function (CommonJS)
// Psycovery

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const input = req.body?.input;
  const quickWins = req.body?.quickWins === true;

  if (!input || typeof input !== 'string' || !input.trim()) {
    return res.status(400).json({ error: 'Missing input text' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const quickWinsInstruction = quickWins
    ? `IMPORTANT: The user has selected "Quick Wins" mode. Suggest only SHORT-TERM goals that can realistically be achieved within 1-2 weeks with simple, immediate action steps. Avoid long-term goals. Each step should be something completable in a single day.`
    : `Suggest goals that are meaningful and achievable over the coming weeks and months.`;

  const systemPrompt = `You are a compassionate goal-setting coach for Hope Forward, an app supporting people rebuilding their lives after the criminal justice system in the UK. You help users turn vague aspirations into concrete, actionable goals grounded in Hope Theory (goals, pathways, agency).

${quickWinsInstruction}

When a user describes something they want to achieve, respond ONLY with a JSON array of exactly 3 goal suggestions. Each suggestion must have:
- "title": a clear, positive, first-person goal statement (e.g. "Find stable housing I'm proud of")
- "category": one of: "Probation & Supervision", "Housing", "Employment", "Education", "Family", "Health", "Finance", "Identity"
- "steps": array of exactly 3 concrete, practical action steps written in first person
- "why": one short sentence explaining how this goal helps them move forward
- "emoji": a single relevant emoji

Respond ONLY with valid JSON. No preamble, no markdown, no explanation. Just the JSON array.`;

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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Here's what I want to achieve: "${input.trim()}"` }],
      }),
    });

    responseText = await response.text();
    console.log('[suggest-goals] HTTP status:', response.status);
    console.log('[suggest-goals] Raw response:', responseText.slice(0, 500));

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      return res.status(502).json({ error: 'Invalid response from AI: ' + responseText.slice(0, 200) });
    }

    if (!response.ok || data.type === 'error') {
      const msg = data?.error?.message || JSON.stringify(data).slice(0, 200);
      console.error('[suggest-goals] Anthropic error:', msg);
      return res.status(502).json({ error: msg });
    }

    const text = (data.content || []).map(b => b.text || '').join('').trim();
    if (!text) return res.status(502).json({ error: 'Empty response from AI. Please try again.' });

    let suggestions;
    try {
      const clean = text.replace(/```json|```/g, '').trim();
      suggestions = JSON.parse(clean);
    } catch (jsonErr) {
      return res.status(502).json({ error: 'Could not parse AI response. Please try again.' });
    }

    return res.status(200).json({ suggestions });

  } catch (e) {
    console.error('[suggest-goals] Fatal error:', e.message, '| Raw:', responseText.slice(0, 300));
    return res.status(500).json({ error: 'Server error: ' + e.message });
  }
};
