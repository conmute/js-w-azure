import { Buffer } from 'node:buffer';
import { scryptSync, createCipheriv, createDecipheriv } from "node:crypto"

const SECRET_KEY = process.env.ACCESS_CONFIG_SECRET
const secterIV = Buffer.alloc(16, 0)
const ECNRYPTION_METHOD = "aes-192-cbc"

const key = scryptSync(SECRET_KEY, 'salt', 24);

function encryptString(text: string) {
  const cipher = createCipheriv(ECNRYPTION_METHOD, key, secterIV);  
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
}

function decryptString(encrypted: string) {
  const decipher = createDecipheriv(ECNRYPTION_METHOD, key, secterIV);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}

export const encodeRecord = (encryptProps: Record<string, unknown>) => {
  return encryptString(JSON.stringify(encryptProps))
}

export const decodeRecord = <T>(encrypted: string): T => {
  return JSON.parse(decryptString(encrypted))
}
