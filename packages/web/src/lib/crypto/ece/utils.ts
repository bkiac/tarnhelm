import {RECORD_SIZE, TAG_LENGTH} from "./constants"

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
