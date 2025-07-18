import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory token store with expiration
const tokens = new Map(); // token => expiration

// Token generator
function generateToken() {
  return crypto.randomBytes(8).toString('hex'); // 16-char token
}

// TTL for tokens (10 minutes)
const TOKEN_LIFESPAN_MS = 10 * 60 * 1000;

// Cleanup expired tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, expiresAt] of tokens.entries()) {
    if (now > expiresAt) tokens.delete(token);
  }
}, 60_000); // check every 60s

// Generate token route
app.get('/api/token', (req, res) => {
  const token = generateToken();
  const expiresAt = Date.now() + TOKEN_LIFESPAN_MS;
  tokens.set(token, expiresAt);
  res.json({ usage: `/playlist?token=${token}` });
});

// Playlist route
app.get('/playlist', (req, res) => {
  const { token } = req.query;
  if (!token || !tokens.has(token)) {
    return res.status(401).send('❌ Invalid or expired token');
  }

  // Optional: consume token (one-time use)
  tokens.delete(token);

  // Respond with a dummy M3U8 or MPD playlist (edit as needed)
  const playlistType = req.query.type || 'm3u8'; // ?type=mpd or m3u8

  if (playlistType === 'mpd') {
    res.set('Content-Type', 'application/dash+xml');
    return res.send(`<?xml version="1.0"?>
<MPD xmlns="urn:mpeg:dash:schema:mpd:2011" type="static" mediaPresentationDuration="PT0H1M0.00S" minBufferTime="PT1.5S">
  <!-- Replace this with your real MPD content -->
</MPD>`);
  } else {
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    return res.send(`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
https://example.com/stream360.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=1280x720
https://example.com/stream720.m3u8`);
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
