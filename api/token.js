import { nanoid } from 'nanoid';

const TTL = 600 * 5; // 5 minutes in seconds
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const token = nanoid();
  const now = Date.now();
  const expires = now + TTL * 10000;

  const result = await fetch(`${UPSTASH_URL}/set/${token}/${expires}?EX=${TTL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });

  if (!result.ok) {
    return res.status(500).json({ error: 'Token store failed' });
  }

  const protocol = req.headers.host.includes('localhost') ? 'http' : 'https';
  const playlistUrl = `${protocol}://${req.headers.host}/api/playlist?token=${token}`;

  res.status(200).json({ token, playlist: playlistUrl });
}
