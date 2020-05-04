interface ReducerActionWithoutPayload<T> {
  type: T;
}

interface ReducerActionWithPayload<T, P> {
  type: T;
  payload: P;
}

type ReducerAction<T, P = undefined> = P extends undefined
  ? ReducerActionWithoutPayload<T>
  : ReducerActionWithPayload<T, P>;
