import type { SetRequired } from "type-fest"
import * as stream from "../../stream"
import type { ByteArray } from "../utils"
import { KEY_LENGTH, Mode, RECORD_SIZE, TAG_LENGTH } from "./constants"
import { generateContentEncryptionKey } from "./keysmith"
import { generateNonceBase } from "./nonce"
import { slice } from "./slice"

export async function sign(
	key: CryptoKey,
	data: ByteArray,
): Promise<ArrayBuffer> {
	return crypto.subtle.sign("HMAC", key, data)
}

export async function encrypt(
	iv: ByteArray,
	key: CryptoKey,
	plaintext: ByteArray,
): Promise<ArrayBuffer> {
	return crypto.subtle.encrypt(
		{ name: "AES-GCM", iv, tagLength: 128 },
		key,
		plaintext,
	)
}

export async function decrypt(
	iv: ByteArray,
	key: CryptoKey,
	ciphertext: ByteArray,
): Promise<ArrayBuffer> {
	return crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv,
			tagLength: 128,
		},
		key,
		ciphertext,
	)
}

/** Encrypted Content-Encoding Transformer */
export type EceTransformer<I, O> = SetRequired<Transformer<I, O>, "transform">

export type EceHeader = {
	salt: ByteArray
	recordSize: number
	length: number
}

async function createCipher(
	salt: ByteArray,
	ikm: Uint8Array,
	recordSize = RECORD_SIZE,
): Promise<EceTransformer<Uint8Array, Buffer>> {
	type Controller = TransformStreamDefaultController<Buffer>
	type ControllerCallback = TransformStreamDefaultControllerCallback<Buffer>
	type ControllerTransformCallback = TransformStreamDefaultControllerTransformCallback<
		Uint8Array,
		Buffer
	>

	let i = 0
	let prevChunk: Buffer | undefined
	let isFirstChunk = true

	const key = await generateContentEncryptionKey(salt, ikm)
	const { generateNonce } = await generateNonceBase(salt, ikm)

	/**
	 * Pad records so all of them will have the same length.
	 */
	function pad(record: Buffer, isFinal: boolean): Buffer {
		const { length } = record
		if (length + TAG_LENGTH >= recordSize) {
			throw new Error(
				`Buffer too large for record size: ${
					length + TAG_LENGTH
				} >= ${recordSize}`,
			)
		}

		if (isFinal) {
			const padding = Buffer.alloc(1)
			padding.writeUInt8(2, 0) // Use delimiter 2 for final record
			return Buffer.concat([record, padding])
		}

		const padding = Buffer.alloc(recordSize - length - TAG_LENGTH)
		padding.fill(0)
		padding.writeUInt8(1, 0) // Use delimiter 1 for non-final record
		return Buffer.concat([record, padding])
	}

	/**
	 * Prepend salt and record size to the stream.
	 */
	function writeHeader(): Buffer {
		const nums = Buffer.alloc(5)
		nums.writeUIntBE(recordSize, 0, 4)
		nums.writeUIntBE(0, 4, 1)
		return Buffer.concat([Buffer.from(salt), nums])
	}

	async function encryptRecord(
		record: Buffer,
		isFinal: boolean,
	): Promise<Buffer> {
		const nonce = generateNonce(i)
		const ciphertext = await encrypt(nonce, key, pad(record, isFinal))
		return Buffer.from(ciphertext)
	}

	async function transformPrevChunk(
		chunk: Buffer,
		isFinal: boolean,
		controller: Controller,
	): Promise<void> {
		const encrypted = await encryptRecord(chunk, isFinal)
		controller.enqueue(encrypted)
		i += 1
	}

	const start: ControllerCallback = (controller) => {
		controller.enqueue(writeHeader())
	}

	const transform: ControllerTransformCallback = async (chunk, controller) => {
		if (!isFirstChunk && prevChunk) {
			await transformPrevChunk(prevChunk, false, controller)
		}
		isFirstChunk = false
		prevChunk = Buffer.from(chunk.buffer)
	}

	const flush: ControllerCallback = async (controller) => {
		if (prevChunk) {
			await transformPrevChunk(prevChunk, true, controller)
		}
	}

	return { start, transform, flush }
}

function createDecipher(ikm: Uint8Array): EceTransformer<Uint8Array, Buffer> {
	type Controller = TransformStreamDefaultController<Buffer>
	type ControllerCallback = TransformStreamDefaultControllerCallback<Buffer>
	type ControllerTransformCallback = TransformStreamDefaultControllerTransformCallback<
		Uint8Array,
		Buffer
	>

	let i = 0
	let prevChunk: Buffer | undefined
	let isFirstChunk = true

	let generateNonce: (seq: number) => Buffer
	let key: CryptoKey

	/**
	 * Un-pad a padded record.
	 */
	function unpad(record: Buffer, isFinal: boolean): Buffer {
		for (let j = record.length - 1; j >= 0; j--) {
			const byte = record[j]
			if (byte !== 0) {
				if (isFinal && byte !== 2) {
					throw new Error("Delimiter of final record is not 2.")
				}
				if (!isFinal && byte !== 1) {
					throw new Error("Delimiter of non-final record is not 1.")
				}
				return record.slice(0, j)
			}
		}
		throw new Error("No delimiter found.")
	}

	function readHeader(header: Buffer): EceHeader {
		if (header.length < 21) {
			throw new Error("Chunk too small for reading header.")
		}
		const salt = header.buffer.slice(0, KEY_LENGTH)
		const rs = header.readUIntBE(KEY_LENGTH, 4)
		const length = header.readUInt8(KEY_LENGTH + 4) + KEY_LENGTH + 5
		return { salt, recordSize: rs, length }
	}

	async function decryptRecord(
		record: Buffer,
		isFinal: boolean,
	): Promise<Buffer> {
		const nonce = generateNonce(i - 1)
		const plaintext = await decrypt(nonce, key, record)
		return unpad(Buffer.from(plaintext), isFinal)
	}

	async function transformPrevChunk(
		chunk: Buffer,
		isFinal: boolean,
		controller: Controller,
	): Promise<void> {
		if (i === 0) {
			// The first chunk during decryption contains only the header
			const header = readHeader(chunk)
			key = await generateContentEncryptionKey(header.salt, ikm)
			;({ generateNonce } = await generateNonceBase(header.salt, ikm))
		} else {
			controller.enqueue(await decryptRecord(chunk, isFinal))
		}
		i += 1
	}

	const start: ControllerCallback = () => {}

	const transform: ControllerTransformCallback = async (chunk, controller) => {
		if (!isFirstChunk && prevChunk) {
			await transformPrevChunk(prevChunk, false, controller)
		}
		isFirstChunk = false
		prevChunk = Buffer.from(chunk.buffer)
	}

	const flush: ControllerCallback = async (controller) => {
		if (prevChunk) {
			await transformPrevChunk(prevChunk, true, controller)
		}
	}

	return { start, transform, flush }
}

export async function encryptStream(
	salt: ByteArray,
	ikm: Uint8Array,
	plaintext: ReadableStream<Uint8Array>,
): Promise<ReadableStream<Buffer>> {
	const sliced = slice(Mode.Encrypt, plaintext)
	const cipher = await createCipher(salt, ikm)
	return stream.transform(sliced, cipher)
}

export function decryptStream(
	ikm: Uint8Array, // Salt is stored in the header of the encrypted stream
	ciphertext: ReadableStream<Uint8Array>,
): ReadableStream<Buffer> {
	const sliced = slice(Mode.Decrypt, ciphertext)
	const decipher = createDecipher(ikm)
	return stream.transform(sliced, decipher)
}
