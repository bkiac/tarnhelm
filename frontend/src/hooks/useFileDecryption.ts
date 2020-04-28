import { useCallback, useReducer, useEffect, Reducer } from 'react';

import * as stream from '../lib/stream';
import * as crypto from '../lib/crypto';
import * as base64 from '../lib/base64';
import useLoadableResult from './useLoadableResult';

enum ActionTypes {
  Start,
  Finish,
}

interface State {
  loading: boolean;
  ikm?: Uint8Array;
  input?: Blob;
  output?: ReadableStream<Uint8Array>;
}

type Start = ReducerAction<ActionTypes.Start, { blob: Blob; secret: string }>;
type Finish = ReducerAction<ActionTypes.Finish, ReadableStream<Uint8Array>>;

type Action = Start | Finish;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.Start:
      return {
        input: action.payload.blob,
        ikm: base64.toArray(action.payload.secret),
        loading: true,
      };

    case ActionTypes.Finish:
      return {
        ...state,
        loading: false,
        output: action.payload,
      };

    default:
      return state;
  }
};

type DecryptFn = (blob: Blob, secret: string) => void;

export default (): [LoadableResult<ReadableStream<Uint8Array>>, DecryptFn] => {
  const [{ input, ikm, output, loading }, dispatch] = useReducer(reducer, { loading: false });

  const decrypt = useCallback<DecryptFn>(
    (blob, secret) => dispatch({ type: ActionTypes.Start, payload: { blob, secret } }),
    [],
  );

  useEffect(() => {
    if (loading) {
      if (input && ikm) {
        const blobStream = stream.createBlobStream(input);
        const plaintext = crypto.ece.decryptStream(blobStream, { ikm });
        dispatch({ type: ActionTypes.Finish, payload: plaintext });
      }
    }
  }, [loading, input, ikm]);

  return [useLoadableResult(loading, output), decrypt];
};
