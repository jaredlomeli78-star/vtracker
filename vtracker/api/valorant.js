// api/valorant.js
// Vercel Serverless Function — secure proxy for Henrik Dev Valorant API
// Keeps your API key hidden from the browser

const HENRIK_BASE = 'https://api.henrikdev.xyz';

export default async function handler(req, res) {
  // Allow CORS for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.VITE_HENRIK_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured. Add VITE_HENRIK_KEY to Vercel environment variables.' });
  }

  const path = req.query.path;

  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter.' });
  }

  const url = `${HENRIK_BASE}${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({
      error: 'Failed to reach Henrik Dev API.',
      detail: err.message
    });
  }
}
