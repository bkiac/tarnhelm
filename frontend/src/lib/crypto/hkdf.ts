export async function importKey(inputKeyMaterial: ArrayBuffer): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', inputKeyMaterial, 'HKDF', false, ['deriveKey']);
}

export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.exportKey('raw', key);
}

/**
 * Derive a secret key from a master key.
 * Compiler errors are suppressed
 * because TypeScript doesn't recognize the HKDF algorithm.
 * https://developer.mozilla.org/en-US/docs/Web/API/HkdfParams
 */
export async function deriveKey(
  masterKey: CryptoKey,
  params: HkdfDeriveParams,
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

export async function generateKey(ikm: ArrayBuffer, params: HkdfDeriveParams): Promise<CryptoKey> {
  const masterKey = await importKey(ikm);
  return deriveKey(masterKey, params);
}
