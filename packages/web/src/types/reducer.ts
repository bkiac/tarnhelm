export interface ReducerActionWithoutPayload<T> {
	type: T
}

export interface ReducerActionWithPayload<T, P> {
	type: T
	payload: P
}

export type ReducerAction<T, P = undefined> = P extends undefined
	? ReducerActionWithoutPayload<T>
	: ReducerActionWithPayload<T, P>
