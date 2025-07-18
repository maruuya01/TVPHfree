// /api/proxy.js
export default async function handler(req, res) {
  const { url } = req.query;
  const baseURL = 'http://143.44.136.110:6910/001/2/ch00000090990000001155';
const CONVRG_MANIFEST_SUFFIX = '/manifest.mpd?virtualDomain=001.live_hls.zte.com&IASHttpSessionId=OTT';

const fullURL = baseURL + CONVRG_MANIFEST_SUFFIX;
const proxiedURL = `https://tvpinas.vercel.app/api/proxy?url=${encodeURIComponent(fullURL)}`;


  if (!url) {
    return res.status(400).send("Missing URL");
  }

  try {
    const astroRes = await fetch(url, {
      method: "GET",
      headers: {
        "referer": "https://astrogo.astro.com.my/",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; MI 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5563.58 Mobile Safari/537.36",
        "accept": "*/*",
        "origin": "https://astrogo.astro.com.my",
        "connection": "keep-alive"
      }
    });

    if (!astroRes.ok) {
      return res.status(astroRes.status).send("Upstream fetch error");
    }

    res.setHeader("Content-Type", astroRes.headers.get("content-type") || "application/xml");

    // Important: If body is a stream
    astroRes.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
