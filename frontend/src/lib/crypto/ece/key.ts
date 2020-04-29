/** Utility functions for HKDF key derivation to be used in AES-128-GCM encryption. */

/** Imports a key from external, portable material. */
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
  /* eslint-disable @typescript-eslint/ban-ts-comment */
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
