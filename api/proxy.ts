// proxy.ts - Works in Next.js or Remix with Vercel deployment
export default async function handler(req, res) {
  const target = req.query.url as string;
  const baseURL = 'http://143.44.136.110:6910/001/2/ch00000090990000001155';
const CONVRG_MANIFEST_SUFFIX = '/manifest.mpd?virtualDomain=001.live_hls.zte.com&IASHttpSessionId=OTT';

const fullURL = baseURL + CONVRG_MANIFEST_SUFFIX;
const proxiedURL = `https://tvpinas.vercel.app/api/proxy?url=${encodeURIComponent(fullURL)}`;


  if (!target || !target.startsWith('http')) {
    return res.status(400).send('Invalid URL');
  }

  try {
    const fetchRes = await fetch(target, {
      headers: {
        // Optional: Pass through headers if needed
        'User-Agent': req.headers['user-agent'] || '',
      },
    });

    // Pipe headers and response
    res.setHeader('Content-Type', fetchRes.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(fetchRes.status);
    fetchRes.body?.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
}
