import { useCallback, useReducer, useEffect, Reducer } from 'react';

import * as file from '../lib/file';
import { isAnyLoading, exists } from '../utils';
import useBlobDownload from './useBlobDownload';
import useFileDecryption from './useFileDecryption';

enum ActionTypes {
  Reset,
  Download,
  Decrypt,
  Save,
}

enum Status {
  Standby,
  Downloading,
  Decrypting,
  Saving,
}

interface State {
  id?: string;
  secret?: string;
  loading: boolean;
  status: Status;
}

type Reset = ReducerAction<ActionTypes.Reset>;
type Download = ReducerAction<ActionTypes.Download, { id: string; secret: string }>;
type Decrypt = ReducerAction<ActionTypes.Decrypt>;
type Save = ReducerAction<ActionTypes.Save>;

type Action = Reset | Download | Decrypt | Save;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionTypes.Reset:
      return {
        ...state,
        loading: false,
        status: Status.Standby,
      };

    case ActionTypes.Download:
      return {
        loading: true,
        id: action.payload.id,
        secret: action.payload.secret,
        status: Status.Downloading,
      };

    case ActionTypes.Decrypt:
      return {
        ...state,
        loading: true,
        status: Status.Decrypting,
      };

    case ActionTypes.Save:
      return {
        ...state,
        loading: true,
        status: Status.Saving,
      };

    default:
      return state;
  }
};

interface Progress {
  loading: boolean;
}

type DownloadFn = (id: string, secret: string) => void;

export default function useDecryptedFileDownload(): [Progress, DownloadFn] {
  const [{ id, secret, loading, status }, dispatch] = useReducer(reducer, {
    loading: false,
    status: Status.Standby,
  });

  const downloadAndDecrypt = useCallback<DownloadFn>((_id, _secret) => {
    dispatch({ type: ActionTypes.Download, payload: { id: _id, secret: _secret } });
  }, []);

  const [{ loading: downloading, data: blob }, download] = useBlobDownload();
  const [{ loading: decrypting, data: plaintext }, decrypt] = useFileDecryption();

  // Handle download on ID change
  useEffect(() => {
    if (status === Status.Downloading) {
      if (exists(id)) {
        download(id);
        dispatch({ type: ActionTypes.Decrypt });
      }
    }
  }, [status, id, download]);

  // Handle decryption on download finish
  useEffect(() => {
    if (status === Status.Decrypting) {
      if (exists(secret) && blob) {
        decrypt(blob, secret);
        dispatch({ type: ActionTypes.Save });
      }
    }
  }, [status, downloading, secret, blob, decrypt]);

  // Handle saving to file system on decryption finish
  useEffect(() => {
    if (status === Status.Saving) {
      (async () => {
        if (exists(id) && plaintext) {
          await file.save(plaintext, { name: id });
          dispatch({ type: ActionTypes.Reset });
        }
      })();
    }
  }, [status, downloading, decrypting, id, plaintext]);

  return [{ loading: isAnyLoading(loading, downloading, decrypting) }, downloadAndDecrypt];
}
