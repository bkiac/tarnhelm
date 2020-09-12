export const MAX_INT32 = 0xffffffff; // = (2^32) - 1 = 4294967295

export function generateRandom(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}
