import express from 'express';
import cors from 'cors';
import encryptRoutes from './routes/encrypt.routes';

const app = express();
const PORT = 3000;

// Middleware base
app.use(express.json());

// ✅ Configurar CORS para permitir Angular
app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// ✅ Ruta base para la API
app.use('/api/encrypt', encryptRoutes);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
