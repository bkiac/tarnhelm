import type stream from "stream"
import type {r} from "../result"

export namespace Stash {
	export type Key = string

	export type Progress = {
		loaded: number
		total: number
	}

	export type Listener = (progress: Progress) => void

	export type Blob = {
		readonly key: Key
		readonly location: string
		/** base64 string */
		readonly auth: string
		/** Additional properties (file name, type, etc.) encrypted before upload */
		readonly properties: string
		readonly length: number
		nonce: string
		downloads: {
			current: number
			readonly limit: number
		}
	}

	export type BlobUploadInput = {
		limit: number
		body: stream.Readable
		length: number
		expiry: Date
	} & Pick<Blob, "key" | "auth" | "properties" | "nonce">

	export type BlobUpdateInput = {
		numOfDownloads?: number
		nonce?: string
	}

	export type Client = {
		upload: (
			input: BlobUploadInput,
			listener?: Listener,
		) => r.PromiseResult<Blob>
		download: (key: Key) => r.Result<stream.Readable>
		get: (key: Key) => r.PromiseResult<Blob>
		update: (input: BlobUpdateInput) => r.PromiseResult<Blob>
		delete: (key: Key) => r.PromiseResult<Key>
		bumpDownloads: (key: Key) => r.PromiseResult<Blob>
		updateNonce: (key: Key, nonce: string) => r.PromiseResult<Blob>
	}
}
