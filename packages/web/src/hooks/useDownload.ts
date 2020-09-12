import { useCallback, useEffect, useMemo, useReducer, Reducer } from 'react';
import axios from 'axios';
import isNil from 'lodash.isnil';

import * as stream from '../lib/stream';
import * as file from '../lib/file';
import useKeyring from './useKeyring';

enum Status {
  KeyringSetup,
  Ready,

  MetadataPending,
  MetadataSuccess,
  MetadataFailure,

  DownloadPending,
  DownloadSuccess,
  DownloadFailure,
}

interface ContentMetadata {
  name: string;
  size: string;
  type: string;
}

interface State {
  loading: boolean;
  status: Status;
  metadata?: ContentMetadata;
  signature?: string;
  error?: Error;
}

const initialState = {
  loading: false,
  status: Status.KeyringSetup,
};

enum ActionType {
  SetReady,

  SetMetadataPending,
  SetMetadataSuccess,
  SetMetadataFailure,

  SetDownloadPending,
  SetDownloadSuccess,
  SetDownloadFailure,
}

type SetReady = ReducerAction<ActionType.SetReady>;
type SetMetadataPending = ReducerAction<ActionType.SetMetadataPending>;
type SetMetadataSuccess = ReducerAction<
  ActionType.SetMetadataSuccess,
  { metadata: ContentMetadata; signature: string }
>;
type SetMetadataFailure = ReducerAction<ActionType.SetMetadataFailure, Error>;
type SetDownloadPending = ReducerAction<ActionType.SetDownloadPending>;
type SetDownloadSuccess = ReducerAction<ActionType.SetDownloadSuccess>;
type SetDownloadFailure = ReducerAction<ActionType.SetDownloadFailure, Error>;

type Action =
  | SetReady
  | SetMetadataPending
  | SetMetadataSuccess
  | SetMetadataFailure
  | SetDownloadPending
  | SetDownloadSuccess
  | SetDownloadFailure;

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.SetReady:
      return {
        ...state,
        loading: false,
        status: Status.Ready,
      };

    case ActionType.SetMetadataPending:
      return {
        loading: true,
        status: Status.MetadataPending,
      };
    case ActionType.SetMetadataSuccess:
      return {
        ...state,
        loading: true,
        status: Status.MetadataSuccess,
        metadata: action.payload.metadata,
        signature: action.payload.signature,
      };
    case ActionType.SetMetadataFailure:
      return {
        ...state,
        loading: false,
        status: Status.MetadataFailure,
        error: action.payload,
      };

    case ActionType.SetDownloadPending:
      return {
        ...state,
        loading: true,
        status: Status.DownloadPending,
      };
    case ActionType.SetDownloadSuccess:
      return {
        ...state,
        loading: false,
        status: Status.DownloadSuccess,
      };
    case ActionType.SetDownloadFailure:
      return {
        ...state,
        loading: false,
        status: Status.DownloadFailure,
        error: action.payload,
      };

    default:
      return state;
  }
};

interface Metadata {
  nonce: string;
  encryptedContentMetadata: string;
}

type DownloadFn = () => void;

export default function useDownload(id: string, secretb64: string): [State, DownloadFn] {
  const keyring = useKeyring(secretb64);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { status, metadata, signature } = state;

  const download = useCallback<DownloadFn>(() => {
    if (status === Status.Ready) dispatch({ type: ActionType.SetDownloadPending });
  }, [status]);

  useEffect(() => {
    if (status === Status.KeyringSetup && keyring)
      dispatch({ type: ActionType.SetMetadataPending });
  }, [status, keyring]);

  useEffect(() => {
    if (keyring) {
      if (status === Status.MetadataPending) {
        (async () => {
          try {
            const {
              data: { encryptedContentMetadata, nonce },
            } = await axios.get<Metadata>(`/metadata/${id}`);

            const _metadata = await keyring.decryptMetadata<ContentMetadata>(
              encryptedContentMetadata,
            );
            const _signature = await keyring.sign(nonce);

            dispatch({
              type: ActionType.SetMetadataSuccess,
              payload: { metadata: _metadata, signature: _signature },
            });
            dispatch({ type: ActionType.SetReady });
          } catch (e) {
            dispatch({
              type: ActionType.SetMetadataFailure,
              payload: e as Error,
            });
          }
        })();
      }
    }
  }, [keyring, id, status]);

  useEffect(() => {
    if (keyring && !isNil(signature) && metadata) {
      if (status === Status.DownloadPending) {
        (async () => {
          try {
            const response = await axios.get(`/download/${id}`, {
              responseType: 'blob',
              headers: {
                Authorization: signature,
              },
            });

            const blob = new Blob([response.data]);
            const blobStream = stream.createBlobStream(blob);
            const plaintext = keyring.decryptStream(blobStream);
            await file.save(plaintext, { name: metadata.name, type: metadata.type });

            dispatch({ type: ActionType.SetDownloadSuccess });
            dispatch({ type: ActionType.SetReady });
          } catch (e) {
            dispatch({ type: ActionType.SetDownloadFailure, payload: e as Error });
          }
        })();
      }
    }
  }, [keyring, id, signature, metadata, status]);

  return useMemo(() => [state, download], [state, download]);
}
