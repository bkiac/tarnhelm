/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
export namespace r {
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

	export const tryCatch = <T>(fn: () => T): Result<T> => {
		try {
			const data = fn()
			return ok(data)
		} catch (e: unknown) {
			return err(e as Error)
		}
	}
	export const tc = tryCatch

	export const wrapTryCatch =
		<F extends (...args: any[]) => any>(fn: F) =>
		(...args: Parameters<F>): Result<ReturnType<F>> =>
			tryCatch(() => fn(...args))
	export const wtc = wrapTryCatch

	export const tryCatchAsync = async <T>(
		fn: () => Promise<T>,
	): PromiseResult<T> => {
		try {
			const data = await fn()
			return ok(data)
		} catch (e: unknown) {
			return err(e as Error)
		}
	}

	export const wrapTryCatchAsync =
		<F extends (...args: any[]) => Promise<any>>(fn: F) =>
		async (...args: Parameters<F>): PromiseResult<Awaited<ReturnType<F>>> =>
			tryCatchAsync(async () => fn(...args))
	export const wtca = wrapTryCatchAsync
}
