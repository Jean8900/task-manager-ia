import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || '';
const MISTRAL_MODEL = 'mistral-small-latest';

if (!MISTRAL_API_KEY) {
  console.warn('WARNING: MISTRAL_API_KEY is not set. /api/chat will return 500 and the UI will silently fall back to canned responses.');
}

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message, system } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'missing message' });
  }
  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ error: 'MISTRAL_API_KEY missing on server' });
  }

  const messages = [];
  if (system && typeof system === 'string') {
    messages.push({ role: 'system', content: system });
  }
  messages.push({ role: 'user', content: message });

  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
      }),
    });

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      return res.status(502).json({ error: `Mistral API error: ${errText}` });
    }

    const data = await mistralRes.json();
    const answer = data.choices?.[0]?.message?.content ?? '';
    res.json({ answer });
  } catch (err) {
    res.status(502).json({ error: `Mistral network error: ${err.message}` });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
