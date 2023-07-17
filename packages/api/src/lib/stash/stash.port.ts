import type stream from "stream"
import type {r} from "../result"

export namespace Stash {
	export type Id = string

	export type Progress = {
		loaded: number
		total: number
	}

	export type Listener = (progress: Progress) => void

	export type Entity = {
		readonly id: Id
		/** base64 string */
		readonly auth: string
		/** Additional properties (file name, type, etc.) encrypted before upload */
		readonly properties: string
		readonly length: number
		nonce: string
		download: {
			count: number
			readonly limit: number
		}
	}

	export type UploadArgs = {
		id?: Id
		downloadLimit: number
		stream: stream.Readable
		length: number
		expiry: Date
		listener?: Listener
	} & Pick<Entity, "auth" | "properties">

	export type IdArgs = {id: Id}

	export type UpdateArgs = {
		downloadCount?: number
		nonce?: string
	} & IdArgs

	export type UpdateNonceArgs = {
		nonce: string
	} & IdArgs

	export type Upload = (args: UploadArgs) => r.PromiseResult<Entity>
	export type Download = (args: IdArgs) => r.Result<[stream.Readable, Entity]>
	export type Update = (args: UpdateArgs) => r.PromiseResult<Entity>
	export type Get = (args: IdArgs) => r.PromiseResult<Entity>
	export type IncrementDownloads = (args: IdArgs) => r.PromiseResult<Entity>
	export type UpdateNonce = (args: UpdateNonceArgs) => r.PromiseResult<Entity>

	export type Client = {
		upload: Upload
		download: Download
		get: Get
	}

	export type Repository = {
		update: Update
		incrementDownloads: IncrementDownloads
		updateNonce: UpdateNonce
	} & Client

	export type MakeClient = (repo: Repository) => Client
	export type CreateClient = () => Client
}
