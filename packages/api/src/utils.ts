import { memoize } from "lodash"
import type { Server } from "ws"

export const ONE_DAY_IN_SECONDS = 86400

export function log(message: string, meta?: Record<string, unknown>): void {
	// eslint-disable-next-line no-console
	console.log(new Date(), message, meta)
}

export const createStatsLogger = memoize(() => {
	let max = 0
	return (wss: Server, message: string) => {
		const {
			clients: { size: current },
		} = wss
		max = current > max ? current : max
		log(message, { current, max })
	}
})

export function asAsyncListener<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TFunction extends (...args: any[]) => Promise<void>
>(
	asyncListener: TFunction,
	errorFn: (err: unknown) => void = (err) =>
		log("Unhandled Error in async listener", { error: err }),
	cleanupFn?: () => void,
): (...args: Parameters<TFunction>) => void {
	return function listener(...args: Parameters<TFunction>): void {
		async function asyncWorker(): Promise<void> {
			await asyncListener(...args)
		}
		asyncWorker().catch(errorFn).finally(cleanupFn)
	}
}
