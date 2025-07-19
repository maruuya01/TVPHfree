// /api/playlist.js
import channels from '../../data/channels.json';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  try {
    const { token } = req.query;

    if (!token) return res.status(400).send('Missing token');

    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      console.error("❌ Missing Upstash environment variables.");
      return res.status(500).send("Server misconfigured.");
    }

    // Check token
    const check = await fetch(`${UPSTASH_URL}/get/${token}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    if (!check.ok) {
      const text = await check.text();
      console.error("❌ Error checking token:", text);
      return res.status(500).send("Token check failed");
    }

    const json = await check.json();
    const expires = parseInt(json.result);

    if (!expires || Date.now() > expires) {
      return res.status(403).send('Token expired or invalid');
    }

    // Optionally delete token
    await fetch(`${UPSTASH_URL}/del/${token}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
    });

    // Generate .m3u
    let playlist = '#EXTM3U\n';
    for (const key in channels) {
      const ch = channels[key];
      playlist += `#EXTINF:-1 tvg-id="${ch.name}" tvg-logo="${ch.logo}" group-title="Live",${ch.name}\n${ch.manifestUri}\n`;
    }

    res.setHeader('Content-Type', 'application/x-mpegURL');
    res.status(200).send(playlist);

  } catch (err) {
    console.error("🔥 Playlist API error:", err);
    res.status(500).send("Internal Server Error: " + err.message);
  }
}
