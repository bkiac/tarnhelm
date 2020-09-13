import isNil from "lodash.isnil"

interface Response<D> {
	data?: D
	error?: number
}

function parseResponse<D>(message: string): Response<D> {
	return JSON.parse(message) as Response<D>
}

export async function open(uri: string): Promise<WebSocket> {
	return new Promise((resolve, reject) => {
		try {
			const ws = new WebSocket(uri)
			ws.addEventListener("open", () => resolve(ws), { once: true })
		} catch (error: unknown) {
			reject(error)
		}
	})
}

export async function close(ws: WebSocket): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			ws.addEventListener("close", () => resolve(), { once: true })
			ws.close()
		} catch (error: unknown) {
			reject(error)
		}
	})
}

export async function listen<D>(ws: WebSocket): Promise<D> {
	return new Promise<D>((resolve, reject) => {
		ws.addEventListener(
			"message",
			(event) => {
				const res = parseResponse<D>(event.data)
				if (!isNil(res.error)) {
					reject(res.error)
				}
				resolve(res.data)
			},
			{ once: true },
		)
	})
}

export function addMessageListener<D>(
	ws: WebSocket,
	listener: (data: D | undefined, error?: number) => void,
): void {
	ws.addEventListener("message", (event) => {
		const res = parseResponse<D>(event.data)
		listener(res.data, !isNil(res.error) ? res.error : undefined)
	})
}
