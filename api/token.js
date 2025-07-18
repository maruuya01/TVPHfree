export default function handler(req, res) {
  const randomToken = Math.random().toString(36).substring(2, 12);
  const usage = `playlist/${randomToken}`;

  res.status(200).json({ usage });
}
