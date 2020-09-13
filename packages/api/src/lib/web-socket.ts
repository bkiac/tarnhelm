import { pickBy } from "lodash"
import type * as WebSocket from "ws"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send<D extends any>(
	ws: WebSocket,
	message: {
		data?: D
		error?: number
	},
): void {
	return ws.send(JSON.stringify(pickBy(message)))
}
