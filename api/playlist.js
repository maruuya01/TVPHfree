import channels from '../../channels.json';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const verify = await fetch(`${UPSTASH_URL}/get/${token}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });
    const data = await verify.json();
    const expiry = parseInt(data.result);

    if (!expiry || Date.now() > expiry) {
      return res.status(403).json({ error: 'Token expired or invalid' });
    }

    await fetch(`${UPSTASH_URL}/del/${token}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    let m3u = '#EXTM3U\n';
    for (const key in channels) {
      const ch = channels[key];
      m3u += `#EXTINF:-1 tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="Live",${ch.name}\n${ch.url}\n`;
    }

    res.setHeader('Content-Type', 'application/x-mpegURL');
    res.status(200).send(m3u);

  } catch (e) {
    res.status(500).json({ error: 'Server error', detail: e.message });
  }
}
