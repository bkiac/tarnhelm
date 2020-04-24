import base64 from 'base64-js';

export function toBase64(array: Uint8Array): string {
  return base64.fromByteArray(array).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function toArray(string: string): Uint8Array {
  return base64.toByteArray(string + '==='.slice((string.length + 3) % 4));
}
