export const MAX_INT32 = 0xffffffff // = (2^32) - 1 = 4294967295

export const KEY_LENGTH = 16
export const NONCE_LENGTH = 12
export const TAG_LENGTH = 16
export const RECORD_SIZE = 1024 * 64

export enum Mode {
	Encrypt = 0,
	Decrypt = 1,
}

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
	| ArrayBuffer

export function calculateEncryptedSize(
	size: number,
	recordSize = RECORD_SIZE,
	tagLength = TAG_LENGTH,
): number {
	const chunkMetaSize = tagLength + 1 // Chunk metadata, tag and delimiter
	return (
		21 + size + chunkMetaSize * Math.ceil(size / (recordSize - chunkMetaSize))
	)
}

export function generateRandom(length: number): Uint8Array {
	return crypto.getRandomValues(new Uint8Array(length))
}

export function generateSalt(): ArrayBuffer {
	return generateRandom(KEY_LENGTH).buffer
}

export function generateIkm(): Uint8Array {
	return generateRandom(KEY_LENGTH)
}
