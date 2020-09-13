import { MAX_INT32 } from "../utils"
import { NONCE_LENGTH } from "./constants"
import { exportKey, generateNonceKey } from "./keysmith"

/**
 * Check if `number` is in the range of 32-bit integer
 * because the result from a bitwise operation is a 32-bit signed integer.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
 * https://stackoverflow.com/questions/5339538/bitwise-operators-changing-result-of-arithmetic
 */
export function isSafeForBitwiseOperation(number: number): boolean {
	return !(number > MAX_INT32)
}

export function generateNonce(seq: number, nb: Buffer): Buffer {
	if (!isSafeForBitwiseOperation(seq)) {
		throw new Error(`${seq} exceeds limit`)
	}
	const nonce = Buffer.from(nb)
	const m = nonce.readUIntBE(nonce.length - 4, 4)
	// Force unsigned xor
	const xor = (m ^ seq) >>> 0 // eslint-disable-line no-bitwise
	nonce.writeUIntBE(xor, nonce.length - 4, 4)
	return nonce
}

export default async function generateNonceBase(
	salt: ArrayBuffer,
	ikm: Uint8Array,
): Promise<{ nonceBase: Buffer; generateNonce: (seq: number) => Buffer }> {
	const nonceKey = await generateNonceKey(salt, ikm)
	const base = await exportKey(nonceKey)
	const nonceBase = Buffer.from(base.slice(0, NONCE_LENGTH))
	return {
		nonceBase,
		generateNonce: (seq: number): Buffer => generateNonce(seq, nonceBase),
	}
}

export { NONCE_LENGTH }
