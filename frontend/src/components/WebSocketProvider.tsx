import React, {
  FunctionComponent,
  useMemo,
  useReducer,
  useCallback,
  useEffect,
  Reducer,
} from 'react';

import connectWebSocket from '../lib/ws';
import { WebSocketContext } from '../contexts';

interface Props {
  uri: string;
}

enum ActionTypes {
  OpenPending,
  OpenSuccess,
  OpenFailure,
  Close,
}

type OpenPending = ReducerAction<ActionTypes.OpenPending, { uri: string }>;
type OpenSuccess = ReducerAction<ActionTypes.OpenSuccess, { uri: string; ws: WebSocket }>;
type OpenFailure = ReducerAction<ActionTypes.OpenFailure, { uri: string; error: Error }>;
type Close = ReducerAction<ActionTypes.Close, { uri: string }>;

type ConnectionActions = OpenPending | OpenSuccess | OpenFailure | Close;

const reducer: Reducer<Partial<Connections>, ConnectionActions> = (state, action) => {
  switch (action.type) {
    case ActionTypes.OpenPending: {
      const { uri } = action.payload;
      return {
        ...state,
        [uri]: {
          ...state[uri],
          loading: true,
        },
      };
    }

    case ActionTypes.OpenSuccess: {
      const { uri, ws } = action.payload;
      return {
        ...state,
        [uri]: {
          ...state[uri],
          loading: false,
          ws,
        },
      };
    }

    case ActionTypes.OpenFailure: {
      const { uri, error } = action.payload;
      return {
        ...state,
        [uri]: {
          ...state[uri],
          loading: false,
          error,
        },
      };
    }

    case ActionTypes.Close: {
      const { [action.payload.uri]: connectionToRemove, ...restState } = state;
      return restState;
    }

    default:
      throw new Error();
  }
};

const initialState = {};

const WebSocketProvider: FunctionComponent<Props> = ({ uri: baseUri, children }) => {
  const [connections, dispatch] = useReducer(reducer, initialState);

  const setPending = useCallback((uri: string) => {
    dispatch({ type: ActionTypes.OpenPending, payload: { uri } });
  }, []);
  const setSuccess = useCallback((uri: string, ws: WebSocket) => {
    dispatch({ type: ActionTypes.OpenSuccess, payload: { uri, ws } });
  }, []);
  const setFailure = useCallback((uri: string, error: Error) => {
    dispatch({ type: ActionTypes.OpenFailure, payload: { uri, error } });
  }, []);
  const setClosed = useCallback((uri: string) => {
    dispatch({ type: ActionTypes.Close, payload: { uri } });
  }, []);

  /** Handle new connections */
  useEffect(() => {
    async function connect(uri: string): Promise<WebSocket> {
      const connection = connections[uri];
      if (connection && connection.ws) return connection.ws;
      return connectWebSocket(baseUri + uri);
    }

    async function connectMany(): Promise<void> {
      const pendingConnections = Object.entries(connections).filter(
        ([, connection]) => connection && connection.loading,
      );
      await Promise.all(
        pendingConnections.map(async ([uri]) => {
          try {
            const ws = await connect(uri);
            setSuccess(uri, ws);
          } catch (error) {
            setFailure(uri, error);
          }
        }),
      );
    }

    connectMany();
  }, [baseUri, connections, setFailure, setSuccess]);

  const connect = useCallback(
    (uri: string) => {
      const connection = connections[uri];
      if (!connection) {
        setPending(uri);
        return { loading: true };
      }
      return connection;
    },
    [connections, setPending],
  );
  const close = useCallback(
    (uri: string) => {
      setClosed(uri);
    },
    [setClosed],
  );

  const context = useMemo(
    () => ({
      connections,
      connect,
      close,
    }),
    [connections, connect, close],
  );

  return <WebSocketContext.Provider value={context}>{children}</WebSocketContext.Provider>;
};

export default WebSocketProvider;
