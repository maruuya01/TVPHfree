import express from 'express';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// In-memory token store
const validTokens = new Map();

const channels = {
  bbcearth: {
    name: 'BBC Earth',
    type: 'mpd',
    url: 'https://qp-pldt-live-grp-03-prod.akamaized.net/out/u/cg_bbcearth_hd1.mpd'
  },
  dreamworks: {
    name: 'Dreamworks HD',
    type: 'mpd',
    url: 'https://qp-pldt-live-grp-02-prod.akamaized.net/out/u/cg_dreamworks_hd1.mpd'
  },
  fashiontv: {
    name: 'Fashion TV',
    type: 'mpd',
    url: 'https://qp-pldt-live-grp-11-prod.akamaized.net/out/u/dr_fashiontvhd.mpd'
  },
  rckentr: {
    name: 'Rock Entertainment',
    type: 'mpd',
    url: 'https://qp-pldt-live-grp-13-prod.akamaized.net/out/u/dr_rockentertainment.mpd'
  },
  amznmovie: {
    name: 'Amazon Movies',
    type: 'mpd',
    url: 'https://.../cenc.mpd'
  },
  hitsnow: {
    name: 'Hits HD',
    type: 'mpd',
    url: 'https://.../default_ott.mpd'
  },
  kix: {
    name: 'Kix HD',
    type: 'mpd',
    url: 'https://.../kix_hd1.mpd'
  },
  history: {
    name: 'History',
    type: 'mpd',
    url: 'https://.../dr_historyhd.mpd'
  },
  nbcsprts: {
    name: 'NBC Sports',
    type: 'mpd',
    url: 'https://.../master.mpd'
  }
};

app.get('/api/token', (req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  validTokens.set(token, Date.now());
  res.json({ usage: `/playlist?token=${token}` });
});

app.get('/playlist', (req, res) => {
  const { token, id } = req.query;

  if (!token || !validTokens.has(token)) {
    return res.status(403).send('Invalid or missing token');
  }

  if (!id || !channels[id]) {
    return res.status(404).send('Channel not found');
  }

  validTokens.delete(token);

  res.redirect(channels[id].url);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
