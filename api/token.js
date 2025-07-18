import fetch from 'node-fetch';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const token = Math.random().toString(36).substring(2, 10);
  const expires = Date.now() + 1000 * 60 * 5;

  await fetch(`${UPSTASH_URL}/set/${token}/${expires}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`
    }
  });

  res.status(200).json({
    usage: `playlist.m3u8?token=${token}`
  });
}
