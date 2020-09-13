import { pickBy } from "lodash"
import type * as WebSocket from "ws"

export function send(
	ws: WebSocket,
	message: {
		data?: SafeAny
		error?: number
	},
): void {
	return ws.send(JSON.stringify(pickBy(message)))
}
