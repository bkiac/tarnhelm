/** Utility functions for HKDF key derivation and AES128GCM encryption. */
import { isSafeForBitwiseOperation } from '../utils';

export const KEY_LENGTH = 16;
export const NONCE_LENGTH = 12;

export async function importKey(inputKeyMaterial: ArrayBuffer): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', inputKeyMaterial, 'HKDF', false, ['deriveKey']);
}

/**
 * Derive a secret key from a master
 * Compiler errors are suppressed
 * because TypeScript doesn't recognize the HKDF algorithm.
 * https://developer.mozilla.org/en-US/docs/Web/API/HkdfParams
 */
export async function deriveKey(
  masterKey: CryptoKey,
  params: { salt: ArrayBuffer; info: string },
): Promise<CryptoKey> {
  /* eslint-disable @typescript-eslint/ban-ts-ignore */
  const { salt, info } = params;
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      salt,
      // @ts-ignore
      info: new TextEncoder().encode(`Content-Encoding: ${info}\0`),
      hash: 'SHA-256',
    },
    masterKey,
    {
      name: 'AES-GCM',
      length: 128,
    },
    true,
    ['encrypt', 'decrypt'],
  );
  /* eslint-enable */
}

export async function generateKey(ikm: ArrayBuffer, salt: ArrayBuffer): Promise<CryptoKey> {
  const masterKey = await importKey(ikm);
  return deriveKey(masterKey, { salt, info: 'aes128gcm' });
}

export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.exportKey('raw', key);
}

export function generateNonce(seq: number, nb: Buffer): Buffer {
  if (!isSafeForBitwiseOperation(seq)) {
    throw new Error(`${seq} exceeds limit`);
  }
  const nonce = Buffer.from(nb);
  const m = nonce.readUIntBE(nonce.length - 4, 4);
  // Force unsigned xor
  const xor = (m ^ seq) >>> 0; // eslint-disable-line no-bitwise
  nonce.writeUIntBE(xor, nonce.length - 4, 4);
  return nonce;
}

export async function generateNonceBase(
  ikm: ArrayBuffer,
  salt: ArrayBuffer,
): Promise<{ nonceBase: Buffer; generateNonce: (seq: number) => Buffer }> {
  const masterKey = await importKey(ikm);
  const secretKey = await deriveKey(masterKey, { salt, info: 'nonce' });
  const base = await exportKey(secretKey);

  const nonceBase = Buffer.from(base.slice(0, NONCE_LENGTH));
  const _generateNonce = (seq: number): Buffer => generateNonce(seq, nonceBase);

  return {
    nonceBase,
    generateNonce: _generateNonce,
  };
}

export async function encrypt(iv: Buffer, key: CryptoKey, plaintext: Buffer): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
}

export async function decrypt(
  iv: Buffer,
  key: CryptoKey,
  ciphertext: Buffer,
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    ciphertext,
  );
}
