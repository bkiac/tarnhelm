import type stream from "stream"
import type {r} from "../result"

export namespace Storage {
	export type Key = string

	export type Progress = {
		loaded: number
		total: number
	}

	export type Listener = (progress: Progress) => void

	export type Data = {
		key: Key
		location: string
	}

	export type Client = {
		set: (
			key: Key,
			body: stream.Readable,
			length: number,
			listener?: Listener,
		) => r.PromiseResult<Data>
		get: (key: Key) => r.Result<stream.Readable>
		delete: (...keys: Key[]) => r.PromiseResult<void>
		list: (limit: number, cursor: string) => r.Result<Key[]>
	}
}
