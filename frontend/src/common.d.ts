declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

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
