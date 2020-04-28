import { useCallback, useEffect, useReducer, Reducer } from 'react';
import axios from 'axios';

import useLoadableResult from './useLoadableResult';

enum ActionTypes {
  Start,
  Finish,
}

interface State {
  id?: string;
  blob?: Blob;
  loading: boolean;
}

type Start = ReducerAction<ActionTypes.Start, string>;
type Finish = ReducerAction<ActionTypes.Finish, Blob>;

type Action = Start | Finish;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.Start:
      return {
        id: action.payload,
        loading: true,
      };

    case ActionTypes.Finish:
      return {
        ...state,
        loading: false,
        blob: action.payload,
      };

    default:
      return state;
  }
};

type DownloadFn = (id: string) => void;

export default (): [LoadableResult<Blob>, DownloadFn] => {
  const [{ id, loading, blob }, dispatch] = useReducer(reducer, { loading: false });

  const download = useCallback<DownloadFn>(
    (_id) => dispatch({ type: ActionTypes.Start, payload: _id }),
    [],
  );

  useEffect(() => {
    if (loading) {
      // TODO: Handle cancellation and failure
      (async (): Promise<void> => {
        if (id) {
          const response = await axios.get(`/download/${id}`, {
            responseType: 'blob',
          });
          dispatch({ type: ActionTypes.Finish, payload: new Blob([response.data]) });
        }
      })();
    }
  }, [loading, id]);

  return [useLoadableResult(loading, blob), download];
};
