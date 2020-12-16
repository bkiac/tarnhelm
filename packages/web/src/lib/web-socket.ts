export type WebSocketResponse<D> =
	| {
			data: undefined
			error: number
	  }
	| { data: D; error: undefined }

function parseResponse<D>(message: string): WebSocketResponse<D> {
	return JSON.parse(message) as WebSocketResponse<D>
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
				const r = parseResponse<D>(event.data)
				if (r.error != null) {
					return reject(r.error)
				}
				return resolve(r.data)
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
		const { data, error } = parseResponse<D | undefined>(event.data)
		listener(data, error)
	})
}
