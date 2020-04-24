import { KEY_LENGTH, NONCE_LENGTH } from './constants';
import { isSafeForBitwiseOperation } from './utils';
import * as hkdf from './hkdf';

export function salt(length = KEY_LENGTH): ArrayBuffer {
  return crypto.getRandomValues(new Uint8Array(length));
}

export async function nonceBase(ikm: ArrayBuffer, params: HkdfDeriveParams): Promise<Buffer> {
  const masterKey = await hkdf.importKey(ikm);
  const secretKey = await hkdf.deriveKey(masterKey, params);
  const base = await hkdf.exportKey(secretKey);
  return Buffer.from(base.slice(0, NONCE_LENGTH));
}

export function nonce(seq: number, nb: Buffer): Buffer {
  if (!isSafeForBitwiseOperation(seq)) {
    throw new Error(`${seq} exceeds limit`);
  }
  const n = Buffer.from(nb);
  const m = n.readUIntBE(nonce.length - 4, 4);
  // Force unsigned xor
  const xor = (m ^ seq) >>> 0; // eslint-disable-line no-bitwise
  n.writeUIntBE(xor, n.length - 4, 4);
  return n;
}
