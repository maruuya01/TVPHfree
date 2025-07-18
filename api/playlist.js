import fetch from 'node-fetch';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");

  const result = await fetch(`${UPSTASH_URL}/get/${token}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`
    }
  }).then(res => res.json());

  const expires = parseInt(result.result);
  if (!expires || Date.now() > expires) {
    return res.status(403).send("Token expired or invalid");
  }

  await fetch(`${UPSTASH_URL}/del/${token}`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`
    }
  });

  res.setHeader('Content-Type', 'application/x-mpegURL');
  res.send(`#EXTM3U
#EXTINF:-1 tvg-name="TV 5" group-title="TV",TV 5
https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/tv5_hd.mpd
#EXTINF:-1 tvg-name="HBO" group-title="TV",HBO
https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_hbohd.mpd
#EXTINF:-1 tvg-name="HBO Hits" group-title="TV",HBO Hits
https://qp-pldt-live-grp-09-prod.akamaized.net/out/u/cg_hbohits.mpd
#EXTINF:-1 tvg-name="Cinemax" group-title="TV",Cinemax
https://qp-pldt-live-grp-01-prod.akamaized.net/out/u/cg_cinemax.mpd
#EXTINF:-1 tvg-name="Cartoon Network" group-title="TV",Cartoon Network
https://qp-pldt-live-grp-12-prod.akamaized.net/out/u/dr_cartoonnetworkhd.mpd
#EXTINF:-1 tvg-name="Tap Movies" group-title="TV",Tap Movies
https://qp-pldt-live-grp-06-prod.akamaized.net/out/u/cg_tapmovies_hd1.mpd
#EXTINF:-1 tvg-name="Anime X Hidive" group-title="TV",Anime X Hidive
https://amc-anime-x-hidive-1-us.tablo.wurl.tv/playlist.m3u8
#EXTINF:-1 tvg-name="Disney XD" group-title="TV",Disney XD
https://a53aivottepl-a.akamaihd.net/pdx-nitro/live/clients/dash/enc/jts4tzzv1k/out/v1/8a5b29f7068c415aa371ea95743382e6/cenc.mpd
#EXTINF:-1 tvg-name="Crunchyroll" group-title="TV",Crunchyroll
https://stitcher.pluto.tv/stitch/hls/channel/65652f7fc0fc88000883537a/master.m3u8?deviceType=web&servertSideAds=false&deviceMake=safari&deviceVersion=1&deviceId=spencer&appVersion=1&deviceDNT=0&deviceModel=web&sid=6780419e-1ba9-11f0-a1fd-4e04716c5414
#EXTINF:-1 tvg-name="CNN" group-title="TV",CNN
https://linearjitp-playback.astro.com.my/dash-wv/linear/2503/default_ott.mpd
#EXTINF:-1 tvg-name="AXN" group-title="TV",AXN
https://linearjitp-playback.astro.com.my/dash-wv/linear/2303/default_ott.mpd
#EXTINF:-1 tvg-name="Crave 1" group-title="TV",Crave 1
https://live-crave.video.9c9media.com/137c6e2e72e1bf67b82614c7c9b216d6f3a8c8281748505659713/fe/f/crave/crave1/manifest.mpd
#EXTINF:-1 tvg-name="Cinemo" group-title="TV",Cinemo
https://d1bail49udbz1k.cloudfront.net/out/v1/3a895f368f4a467c9bca0962559efc19/index.mpd
#EXTINF:-1 tvg-name="AMC Thrillers" group-title="TV",AMC Thrillers
https://436f59579436473e8168284cac5d725f.mediatailor.us-east-1.amazonaws.com/v1/master/44f73ba4d03e9607dcd9bebdcb8494d86964f1d8/Plex_RushByAMC/playlist.m3u8
#EXTINF:-1 tvg-name="GMA PINOY TV" group-title="TV",GMA PINOY TV
https://amg01006-abs-cbn-abscbn-gma-x7-dash-abscbnono-dzsx9.amagi.tv/index.mpd
#EXTINF:-1 tvg-name="TVN Movies" group-title="TV",TVN Movies
https://linearjitp-playback.astro.com.my/dash-wv/linear/2406/default_ott.mpd
#EXTINF:-1 tvg-name="WWE" group-title="TV",WWE
https://fsly.stream.peacocktv.com/Content/CMAF_CTR-4s/Live/channel(vc106wh3yw)/master.mpd
#EXTINF:-1 tvg-name="PBA Rush" group-title="TV",PBA Rush
https://ott.athenatv.net/stream/phcathenatv/pbarush/master.m3u8?u=phc-free&p=8c43211c3fe7f44b1af3deedb89d50ecef2ee4c97eb987071fd3fea18a7b0af7
#EXTINF:-1 tvg-name="Studio Universal" group-title="TV",Studio Universal
https://fta1-cdn-flr.visionplus.id/out/v1/dc63bd198bc44193b570e0567ff5b22c/index.mpd
#EXTINF:-1 tvg-name="Rakuten Viki" group-title="TV",Rakuten Viki
https://fd18f1cadd404894a31a3362c5f319bd.mediatailor.us-east-1.amazonaws.com/v1/master/04fd913bb278d8775298c26fdca9d9841f37601f/RakutenTV-eu_RakutenViki-1/playlist.m3u8
#EXTINF:-1 tvg-name="Ion Plus" group-title="TV",Ion Plus
https://raw.githubusercontent.com/mystery75/m3u8/main/IONPLUS.m3u8
#EXTINF:-1 tvg-name="Dove Channel" group-title="TV",Dove Channel
https://raw.githubusercontent.com/mystery75/m3u8/main/DOVE.m3u8
#EXTINF:-1 tvg-name="Dreamworks HD" group-title="TV",Dreamworks HD
https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_dreamworks_hd1.mpd
#EXTINF:-1 tvg-name="Rock Entertainment" group-title="TV",Rock Entertainment
https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockentertainment.mpd
#EXTINF:-1 tvg-name="Hits HD" group-title="TV",Hits HD
https://linearjitp-playback.astro.com.my/dash-wv/linear/606/default_ott.mpd
#EXTINF:-1 tvg-name="History" group-title="TV",History
https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_historyhd.mpd
#EXTINF:-1 tvg-name="Warner TV" group-title="TV",Warner TV
https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_warnertvhd.mpd
#EXTINF:-1 tvg-name="MYX" group-title="TV",MYX
https://d24xfhmhdb6r0q.cloudfront.net/out/v1/e897a7b6414a46019818ee9f2c081c4f/index.mpd
#EXTINF:-1 tvg-name="Channel News Asia" group-title="TV",Channel News Asia
https://tglmp03.akamaized.net/out/v1/43856347987b4da3890360b0d18b5dc5/manifest.mpd`);
}
