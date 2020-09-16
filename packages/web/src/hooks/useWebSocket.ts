import type { Reducer } from "react"
import { useCallback, useEffect, useReducer } from "react"
import config from "../config"
import * as webSocket from "../lib/web-socket"

enum ConnectionStatus {
	Opening = 0,
	Open = 1,
	Closing = 2,
	Closed = 3,
}

interface Connection {
	loading: boolean
	status: ConnectionStatus
	ws?: WebSocket
	error?: Error
}

enum ActionType {
	ConnectPending = 0,
	ConnectSuccess = 1,
	ConnectFailure = 2,
	DisconnectPending = 3,
	DisconnectSuccess = 4,
	DisconnectFailure = 5,
}

type ConnectPending = ReducerAction<ActionType.ConnectPending>
type ConnectSuccess = ReducerAction<
	ActionType.ConnectSuccess,
	{ ws: WebSocket }
>
type ConnectFailure = ReducerAction<ActionType.ConnectFailure, { error: Error }>
type DisconnectPending = ReducerAction<ActionType.DisconnectPending>
type DisconnectSuccess = ReducerAction<ActionType.DisconnectSuccess>
type DisconnectFailure = ReducerAction<
	ActionType.DisconnectFailure,
	{ error: Error }
>

type ConnectionAction =
	| ConnectPending
	| ConnectSuccess
	| ConnectFailure
	| DisconnectPending
	| DisconnectSuccess
	| DisconnectFailure

const reducer: Reducer<Connection, ConnectionAction> = (state, action) => {
	switch (action.type) {
		case ActionType.ConnectPending: {
			return {
				...state,
				loading: true,
				status: ConnectionStatus.Opening,
			}
		}
		case ActionType.ConnectSuccess: {
			const { ws } = action.payload
			return {
				loading: false,
				status: ConnectionStatus.Open,
				ws,
			}
		}
		case ActionType.ConnectFailure: {
			const { error } = action.payload
			return {
				loading: false,
				status: ConnectionStatus.Closed,
				error,
			}
		}

		case ActionType.DisconnectPending: {
			return {
				...state,
				loading: true,
				status: ConnectionStatus.Closing,
			}
		}
		case ActionType.DisconnectSuccess: {
			return {
				loading: false,
				status: ConnectionStatus.Closed,
			}
		}
		case ActionType.DisconnectFailure: {
			const { error } = action.payload
			return {
				loading: false,
				status: ConnectionStatus.Open,
				error,
			}
		}

		default:
			throw new Error()
	}
}

interface Options {
	lazy: boolean
}

function init(options: Options): Connection {
	if (options.lazy) {
		return { status: ConnectionStatus.Closed, loading: false }
	}
	return {
		status: ConnectionStatus.Opening,
		loading: true,
	}
}

export default function useWebSocket(
	url = "",
	options: Options = { lazy: false },
): [Connection, () => void, () => void] {
	const [connection, dispatch] = useReducer(reducer, init(options))

	const handleConnect = useCallback(
		() => dispatch({ type: ActionType.ConnectPending }),
		[],
	)
	const handleDisconnect = useCallback(() => {
		if (connection.ws) {
			dispatch({ type: ActionType.DisconnectPending })
		}
	}, [connection.ws])

	/** Handle mount, URL change and manual reconnect */
	useEffect(() => {
		if (connection.status === ConnectionStatus.Opening) {
			const connect = async (): Promise<void> => {
				try {
					if (connection.ws) {
						connection.ws.close()
					}
					const ws = await webSocket.open(config().server.origin.ws + url)
					dispatch({ type: ActionType.ConnectSuccess, payload: { ws } })
				} catch (error: unknown) {
					dispatch({
						type: ActionType.ConnectFailure,
						payload: { error: error as Error },
					})
				}
			}

			void connect()
		}
	}, [url, connection.ws, connection.status])

	/** Handle manual disconnect */
	useEffect(() => {
		if (connection.status === ConnectionStatus.Closing) {
			const disconnect = async (): Promise<void> => {
				try {
					if (connection.ws) {
						await webSocket.close(connection.ws)
					}
					dispatch({ type: ActionType.DisconnectSuccess })
				} catch (error: unknown) {
					dispatch({
						type: ActionType.DisconnectFailure,
						payload: { error: error as Error },
					})
				}
			}

			void disconnect()
		}
	}, [connection.ws, connection.status])

	/** Handle unmount */
	useEffect(() => {
		return () => {
			if (connection.ws) {
				connection.ws.close()
			}
		}
	}, [connection.ws])

	return [connection, handleConnect, handleDisconnect]
}