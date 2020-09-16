import { addMilliseconds, differenceInMilliseconds } from "date-fns"
import type { Reducer } from "react"
import { useCallback, useEffect, useMemo, useReducer } from "react"
import * as stream from "../lib/stream"
import * as webSocket from "../lib/web-socket"
import useKeyring from "./useKeyring"
import useWebSocket from "./useWebSocket"

enum Status {
	Setup = 0,
	Ready = 1,
	Starting = 2,
	Uploading = 3,
	Stopping = 4,
}

interface Progress {
	loading: boolean
	ticks: number
	uploadedBytes: number
	percent: number
	estimate?: Date
}

interface Options {
	downloadLimit?: number
	expiry?: number
}

export interface State {
	status: Status
	progress: Progress
	file?: File
	options?: Options
	secret?: string
	id?: string
}

enum ActionType {
	Start = 0,
	SetProgress = 1,
	Stop = 2,
	SetReady = 3,
}

type Start = ReducerAction<ActionType.Start, { file: File; options?: Options }>
type SetProgress = ReducerAction<
	ActionType.SetProgress,
	{ startDate: Date; totalBytes: number; uploadedBytes: number }
>
type Stop = ReducerAction<ActionType.Stop, string>
type SetReady = ReducerAction<ActionType.SetReady>

type Action = Start | SetProgress | Stop | SetReady

const initialState: State = {
	status: Status.Setup,
	progress: {
		loading: true,
		ticks: 0,
		uploadedBytes: 0,
		percent: 0,
		estimate: undefined,
	},
}

const reducer: Reducer<State, Action> = (state, action) => {
	switch (action.type) {
		case ActionType.SetReady:
			return {
				...state,
				status: Status.Ready,
				progress: {
					...state.progress,
					loading: false,
				},
			}

		case ActionType.Start:
			return {
				status: Status.Starting,
				file: action.payload.file,
				options: action.payload.options,
				progress: {
					loading: true,
					ticks: 0,
					uploadedBytes: 0,
					percent: 0,
					estimate: undefined,
				},
			}

		case ActionType.SetProgress: {
			const { startDate, totalBytes, uploadedBytes } = action.payload
			const { ticks: prevTicks } = state.progress

			const ticks = prevTicks + 1
			const finished = uploadedBytes >= totalBytes
			const percent = !finished ? uploadedBytes / totalBytes : 100
			const now = new Date()
			const estimate = !finished
				? addMilliseconds(
						now,
						differenceInMilliseconds(now, startDate) / percent,
				  )
				: now

			const progress = {
				loading: !finished,
				ticks,
				uploadedBytes,
				percent,
				estimate,
			}

			return {
				...state,
				status: Status.Uploading,
				progress,
			}
		}

		case ActionType.Stop:
			return {
				...state,
				status: Status.Stopping,
				id: action.payload,
			}

		default:
			return state
	}
}

type Upload = (file: File, options?: Options) => void

export default function useUpload(): [State & { secretb64?: string }, Upload] {
	const keyring = useKeyring()

	const [{ ws }, connect, disconnect] = useWebSocket("/upload", { lazy: true })

	const [state, dispatch] = useReducer(reducer, initialState)
	const { file, status, options } = state

	const handleUpload = useCallback<Upload>(
		(_file, _options) =>
			dispatch({
				type: ActionType.Start,
				payload: { file: _file, options: _options },
			}),
		[],
	)

	useEffect(() => {
		if (status === Status.Setup && keyring) {
			dispatch({ type: ActionType.SetReady })
		}
	}, [status, keyring])

	/** Handle starting status */
	useEffect(() => {
		if (status === Status.Starting) {
			connect()
		}
	}, [status, connect])

	/** Handle stopping status */
	useEffect(() => {
		if (status === Status.Stopping) {
			dispatch({ type: ActionType.SetReady })
			disconnect()
		}
	}, [status, disconnect])

	// Handle upload
	useEffect(() => {
		// TODO: handle cancellation and socket failure
		// TODO: add delay to wait for socket buffer
		if (keyring && ws && file) {
			if (status === Status.Starting) {
				const upload = async (): Promise<void> => {
					const { name, size, type } = file
					const contentMetadata = {
						name,
						size,
						type,
					}
					const encryptedContentMetadata = await keyring.encryptMetadata(
						contentMetadata,
					)
					const uploadParams = {
						...options,
						authb64: keyring.authb64,
						metadata: encryptedContentMetadata,
					}
					ws.send(JSON.stringify(uploadParams))

					try {
						const id = await webSocket.listen<string>(ws)

						const encryptedFileStream = await keyring.encryptStream(
							stream.createFileStream(file),
						)
						const encryptedSize = keyring.calculateEncryptedSize(size)

						const startDate = new Date()
						webSocket.addMessageListener<number>(ws, (uploadedBytes, error) => {
							if (error != null || uploadedBytes == null) {
								throw new Error("WebSocket Error")
							}
							dispatch({
								type: ActionType.SetProgress,
								payload: {
									uploadedBytes,
									totalBytes: encryptedSize,
									startDate,
								},
							})
							if (uploadedBytes >= encryptedSize) {
								dispatch({ type: ActionType.Stop, payload: id })
							}
						})

						await stream.read(encryptedFileStream, (chunk) => {
							ws.send(chunk)
						})

						if (ws.readyState === WebSocket.OPEN) {
							ws.send(new Uint8Array([0])) // EOF signal
						}
					} catch (err: unknown) {
						// TODO: handle error
					}
				}

				void upload()
			}
		}
	}, [keyring, ws, file, status, options])

	return useMemo(
		() => [{ ...state, secretb64: keyring?.secretb64 }, handleUpload],
		[state, keyring, handleUpload],
	)
}
