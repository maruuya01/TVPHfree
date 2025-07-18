import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/token', (req, res) => {
  const token = generateToken();
  res.json({ usage: token });
});

function generateToken() {
  return Math.random().toString(36).substring(2, 12);
}

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
