import type {SetRequired} from "type-fest"
import * as stream from "../stream"
import {Mode, RECORD_SIZE} from "./util"

function createSlicer(
	mode: Mode,
	recordSize: number,
): SetRequired<Transformer<Uint8Array, Uint8Array>, "transform"> {
	let chunkSize = mode === Mode.Encrypt ? recordSize - 17 : 21
	let partialChunk = new Uint8Array(chunkSize)
	let offset = 0

	function enqueue(
		buffer: Uint8Array,
		controller: TransformStreamDefaultController<Uint8Array>,
	): void {
		controller.enqueue(buffer)
		if (chunkSize === 21 && mode === Mode.Decrypt) {
			chunkSize = recordSize
		}
		partialChunk = new Uint8Array(chunkSize)
		offset = 0
	}

	const transform: TransformerTransformCallback<Uint8Array, Uint8Array> = (
		chunk,
		controller,
	) => {
		let i = 0

		if (offset > 0) {
			const len = Math.min(chunk.byteLength, chunkSize - offset)
			partialChunk.set(chunk.slice(0, len), offset)
			offset += len
			i += len

			if (offset === chunkSize) {
				enqueue(partialChunk, controller)
			}
		}

		while (i < chunk.byteLength) {
			const remainingBytes = chunk.byteLength - i
			if (remainingBytes >= chunkSize) {
				const record = chunk.slice(i, i + chunkSize)
				i += chunkSize
				enqueue(record, controller)
			} else {
				const end = chunk.slice(i, i + remainingBytes)
				i += end.byteLength
				partialChunk.set(end)
				offset = end.byteLength
			}
		}
	}

	const flush: TransformerFlushCallback<Uint8Array> = (controller) => {
		if (offset > 0) {
			controller.enqueue(partialChunk.slice(0, offset))
		}
	}

	return {transform, flush}
}

export function slice(
	mode: Mode,
	input: ReadableStream<Uint8Array>,
	recordSize = RECORD_SIZE,
): ReadableStream<Uint8Array> {
	return stream.transform(input, createSlicer(mode, recordSize))
}
