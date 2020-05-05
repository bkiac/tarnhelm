import base64 from 'base64-js';

export function fromArray(array: Uint8Array | ArrayBuffer): string {
  const byteArray = array instanceof ArrayBuffer ? new Uint8Array(array) : array;
  return base64.fromByteArray(byteArray).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function toArray(string: string): Uint8Array {
  return base64.toByteArray(string + '==='.slice((string.length + 3) % 4));
}
