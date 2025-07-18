//token.js

export default function handler(req, res) {
  const randomToken = Math.random().toString(36).substring(2, 12);
  const usage = `ott-playback/${randomToken}`;

  // ✅ Add CORS headers
res.setHeader('Access-Control-Allow-Origin', 'https://tvphfree.pages.dev');
 // or replace * with your frontend domain
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  res.status(200).json({ usage });
}
