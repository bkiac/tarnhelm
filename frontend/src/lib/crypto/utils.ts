import { MAX_INT32 } from './constants';

/**
 * Check if `number` is in the range of 32-bit integer
 * because the result from a bitwise operation is a 32-bit signed integer.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
 * https://stackoverflow.com/questions/5339538/bitwise-operators-changing-result-of-arithmetic
 */
export function isSafeForBitwiseOperation(number: number): boolean {
  return !(number > MAX_INT32);
}
