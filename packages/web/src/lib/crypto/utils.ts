export const MAX_INT32 = 0xffffffff // = (2^32) - 1 = 4294967295

export type ByteArray =
	| Int8Array
	| Int16Array
	| Int32Array
	| Uint8Array
	| Uint16Array
	| Uint32Array
	| Uint8ClampedArray
	| Float32Array
	| Float64Array
	| DataView
	| ArrayBuffer

export function generateRandom(length: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(length))
}
