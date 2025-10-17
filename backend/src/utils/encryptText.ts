import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const publicKeyPath = path.join(__dirname, '../..', 'keys/public.pem');
const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

/**
 * Encripta un texto plano usando una clave pública RSA.
 * @param text Texto en claro.
 * @returns Texto encriptado en Base64.
 */
export function encryptText(text: string): string {
  const buffer = Buffer.from(text, 'utf8');
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  return encrypted.toString('base64');
}
