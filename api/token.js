// /api/token.js
import { nanoid } from 'nanoid';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      console.error("❌ Missing Upstash environment variables.");
      return res.status(500).json({ error: "Upstash environment variables not set." });
    }

    const ttl = 300000; // 5 minutes in milliseconds
    const token = nanoid();
    const expiry = Date.now() + ttl;

    const response = await fetch(`${UPSTASH_URL}/set/${token}/${expiry}?EX=300`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to store token:", errorText);
      return res.status(500).json({ error: "Failed to store token in Redis." });
    }

    const host = req.headers.host || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const fullUrl = `${protocol}://${host}/api/playlist?token=${token}`;

    res.status(200).json({ token, usage: `/api/playlist?token=${token}`, playlist: fullUrl });
  } catch (err) {
    console.error("🔥 Token API error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
