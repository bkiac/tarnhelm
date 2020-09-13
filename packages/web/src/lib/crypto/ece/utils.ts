import { RECORD_SIZE, TAG_LENGTH } from "./constants"

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
