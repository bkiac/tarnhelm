import isNil from "lodash.isnil"

/* eslint-disable no-await-in-loop */
export async function read<T>(
	stream: ReadableStream<T>,
	callback: (chunk: T) => void,
): Promise<void> {
	const reader = stream.getReader()
	let state = await reader.read()
	while (!state.done) {
		callback(state.value)
		state = await reader.read() // eslint-disable-line no-await-in-loop
	}
}

export function concat<T>(
	streams: Array<ReadableStream<T>>,
): ReadableStream<T> {
	type ControllerCallback = ReadableStreamDefaultControllerCallback<T>

	let index = 0
	let reader: ReadableStreamReader<T> | undefined

	function nextReader(): void {
		// Type is asserted here because `next` can be `undefined` if `index` is too big, but TypeScript doesn't warn about this.
		const next = streams[index] as ReadableStream<T> | undefined
		reader = next?.getReader()
		index += 1
	}

	const pull: ControllerCallback = async (controller) => {
		if (reader) {
			const data = await reader.read()
			if (data.done) {
				nextReader()
				return pull(controller)
			}
			controller.enqueue(data.value)
		}
		return controller.close()
	}

	return new ReadableStream<T>({ pull })
}

export function createBlobStream(
	blob: Blob,
	chunkSize = 1024 * 64,
): ReadableStream<Uint8Array> {
	type ControllerCallback = ReadableStreamDefaultControllerCallback<Uint8Array>

	let index = 0

	const pull: ControllerCallback = async (controller) => {
		return new Promise<void>((resolve, reject) => {
			const bytesLeft = blob.size - index

			if (bytesLeft > 0) {
				const currentChunkSize = Math.min(chunkSize, bytesLeft)
				const slice = blob.slice(index, index + currentChunkSize)

				const reader = new FileReader()
				reader.onload = () => {
					// https://github.com/microsoft/TypeScript/issues/4163#issuecomment-331678032
					controller.enqueue(new Uint8Array(reader.result as ArrayBuffer))
					resolve()
				}
				reader.onerror = reject
				reader.readAsArrayBuffer(slice)

				index += currentChunkSize
			} else {
				controller.close()
				resolve()
			}
		})
	}

	return new ReadableStream({ pull })
}

export function createFileStream(
	f: File | FileList,
): ReadableStream<Uint8Array> {
	if (f instanceof File) {
		return createBlobStream(f)
	}
	return concat(Array.from(f).map(createBlobStream))
}

/**
 * Convert a `Uint8Array` stream to an `ArrayBuffer`.
 */
export async function toArrayBuffer(
	stream: ReadableStream<Uint8Array>,
	size?: number,
): Promise<ArrayBuffer> {
	if (!isNil(size)) {
		const result = new Uint8Array(size)
		let offset = 0
		await read(stream, (chunk) => {
			result.set(chunk, offset)
			offset += chunk.length
		})
		return result.buffer
	}

	const parts: Uint8Array[] = []
	let len = 0
	await read(stream, (chunk) => {
		parts.push(chunk)
		len += chunk.length
	})
	let offset = 0
	const result = new Uint8Array(len)
	parts.forEach((part) => {
		result.set(part, offset)
		offset += part.length
	})
	return result.buffer
}

/**
 * Transform a `ReadableStream`.
 * As `ReadableStream.pipeThrough` is not generally supported,
 * compiler error suppression is allowed
 * so `ReadableStream` controller (`ReadableStreamDefaultController`) can be used
 * as a `TransformStream` controller (`TransformStreamDefaultController`)
 * to implement a manual pipe.
 * See: https://caniuse.com/#search=pipethrough
 */
export function transform<I, O = I>(
	stream: ReadableStream<I>,
	transformer: RequiredBy<Transformer<I, O>, "transform">,
	onCancel?: ReadableStreamErrorCallback,
): ReadableStream<O> {
	try {
		return stream.pipeThrough(new TransformStream(transformer))
	} catch (error: unknown) {
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		const reader = stream.getReader()
		return new ReadableStream({
			start(controller) {
				if (!transformer.start) {
					return undefined
				}
				// @ts-expect-error
				return transformer.start(controller)
			},

			async pull(controller) {
				// Assert type to boolean because TypeScript thinks `enqueue` will always be `false`
				let enqueued = false as boolean

				const wrappedController = {
					enqueue(chunk: O) {
						enqueued = true
						controller.enqueue(chunk)
					},
				}

				while (!enqueued) {
					const data = await reader.read()
					if (data.done) {
						if (transformer.flush) {
							// @ts-expect-error
							await transformer.flush(controller)
						}
						return controller.close()
					}
					// @ts-expect-error
					await transformer.transform(data.value, wrappedController)
				}

				return undefined
			},

			async cancel(reason) {
				await stream.cancel(reason)
				if (onCancel) {
					await onCancel(reason)
				}
			},
		})
		/* eslint-enable */
	}
}
