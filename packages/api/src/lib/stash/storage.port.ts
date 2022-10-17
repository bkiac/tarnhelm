import type stream from "stream"
import type {r} from "../result"

type Key = string

type Progress = {
	loaded: number
	total: number
}

type Listener = (progress: Progress) => void

type Data = {key: string; location: string}

export type Storage = {
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
