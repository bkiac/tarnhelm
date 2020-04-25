export const MAX_INT32 = 0xffffffff; // = (2^32) - 1 = 4294967295

/**
 * Check if `number` is in the range of 32-bit integer
 * because the result from a bitwise operation is a 32-bit signed integer.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
 * https://stackoverflow.com/questions/5339538/bitwise-operators-changing-result-of-arithmetic
 */
export function isSafeForBitwiseOperation(number: number): boolean {
  return !(number > MAX_INT32);
}

export function generateSalt(length: number): ArrayBuffer {
  return crypto.getRandomValues(new Uint8Array(length));
}
