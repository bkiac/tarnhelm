export type Ok<T> = {
	data: T
	ok: true
}

export type Err = {
	err: Error
	ok: false
}

export type Result<T> = Ok<T> | Err

export type PromiseResult<T> = Promise<Result<T>>

export const ok = <T>(data: T): Ok<T> => ({ok: true, data})
export const err = <T extends Error>(error?: T): Err => ({
	ok: false,
	err: error ?? new Error(),
})

const tryCatch = async <T>(fn: () => Promise<T>): PromiseResult<T> => {
	try {
		const data = await fn()
		return ok(data)
	} catch (e: unknown) {
		return err(e as Error)
	}
}
export {tryCatch as try} // function can't be named `try`
