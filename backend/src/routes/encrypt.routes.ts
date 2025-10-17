import express from 'express';
import { encryptText } from '../utils/encryptText';

const router = express.Router();

/**
 * POST /encrypt
 * Recibe un texto y devuelve su versión encriptada con la clave pública RSA.
 */
router.post('/', (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El campo nombre es requerido.' });
  }

  try {
    const encrypted = encryptText(nombre);
    res.json({ data: encrypted });
  } catch (error) {
    console.error('Error en encriptación:', error);
    res.status(500).json({ error: 'Error al encriptar el texto.' });
  }
});

export default router;
