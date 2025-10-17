import express from 'express';
import bodyParser from 'body-parser';
import { encryptText } from './routes/encrypt';

const app = express();
app.use(bodyParser.json());

app.post('/encrypt', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Texto requerido' });

  try {
    const encrypted = encryptText(text);
    res.json({ encrypted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al encriptar' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en http://localhost:${PORT}`));
