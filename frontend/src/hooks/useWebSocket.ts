import { useCallback, useEffect, useReducer, Reducer, Dispatch } from 'react';

import config from '../config';
import * as webSocket from '../lib/web-socket';

enum ConnectionState {
  Opening,
  Open,
  Closing,
  Closed,
}

interface Connection {
  loading: boolean;
  state: ConnectionState;
  ws?: WebSocket;
  error?: Error;
}

enum ActionTypes {
  ConnectPending,
  ConnectSuccess,
  ConnectFailure,
  DisconnectPending,
  DisconnectSuccess,
  DisconnectFailure,
}

type ConnectPending = ReducerAction<ActionTypes.ConnectPending>;
type ConnectSuccess = ReducerAction<ActionTypes.ConnectSuccess, { ws: WebSocket }>;
type ConnectFailure = ReducerAction<ActionTypes.ConnectFailure, { error: Error }>;
type DisconnectPending = ReducerAction<ActionTypes.DisconnectPending>;
type DisconnectSuccess = ReducerAction<ActionTypes.DisconnectSuccess>;
type DisconnectFailure = ReducerAction<ActionTypes.DisconnectFailure, { error: Error }>;

type ConnectionActions =
  | ConnectPending
  | ConnectSuccess
  | ConnectFailure
  | DisconnectPending
  | DisconnectSuccess
  | DisconnectFailure;

const reducer: Reducer<Connection, ConnectionActions> = (state, action) => {
  switch (action.type) {
    case ActionTypes.ConnectPending: {
      return {
        ...state,
        loading: true,
        state: ConnectionState.Opening,
      };
    }
    case ActionTypes.ConnectSuccess: {
      const { ws } = action.payload;
      return {
        loading: false,
        state: ConnectionState.Open,
        ws,
      };
    }
    case ActionTypes.ConnectFailure: {
      const { error } = action.payload;
      return {
        loading: false,
        state: ConnectionState.Closed,
        error,
      };
    }

    case ActionTypes.DisconnectPending: {
      return {
        ...state,
        loading: true,
        state: ConnectionState.Closing,
      };
    }
    case ActionTypes.DisconnectSuccess: {
      return {
        loading: false,
        state: ConnectionState.Closed,
      };
    }
    case ActionTypes.DisconnectFailure: {
      const { error } = action.payload;
      return {
        loading: false,
        state: ConnectionState.Open,
        error,
      };
    }

    default:
      throw new Error();
  }
};

interface Options {
  lazy: boolean;
}

function createClose(dispatch: Dispatch<ConnectionActions>): (ws: WebSocket) => Promise<void> {
  return async function close(ws: WebSocket): Promise<void> {
    try {
      await webSocket.close(ws);
      dispatch({ type: ActionTypes.DisconnectSuccess });
    } catch (error) {
      dispatch({ type: ActionTypes.DisconnectFailure, payload: { error } });
    }
  };
}

function createOpen(
  currentWs: WebSocket | undefined,
  dispatch: Dispatch<ConnectionActions>,
): (uri: string) => Promise<void> {
  return async function open(uri: string): Promise<void> {
    try {
      if (currentWs) currentWs.close();
      const ws = await webSocket.open(config().uri.ws + uri);
      dispatch({ type: ActionTypes.ConnectSuccess, payload: { ws } });
    } catch (error) {
      dispatch({ type: ActionTypes.ConnectFailure, payload: { error } });
    }
  };
}

function init(options: Options): Connection {
  if (options.lazy) {
    return { state: ConnectionState.Closed, loading: false };
  }
  return {
    state: ConnectionState.Opening,
    loading: true,
  };
}

export default (
  uri = '',
  options: Options = { lazy: false },
): [Connection, () => void, () => void] => {
  const [connection, dispatch] = useReducer(reducer, init(options));

  const connect = useCallback(() => dispatch({ type: ActionTypes.ConnectPending }), []);
  const disconnect = useCallback(() => {
    if (connection.ws) {
      dispatch({ type: ActionTypes.DisconnectPending });
    }
  }, [connection.ws]);

  /** Handle mount, URI change and manual reconnect */
  useEffect(() => {
    const open = createOpen(connection.ws, dispatch);
    if (connection.state === ConnectionState.Opening) {
      open(uri);
    }
  }, [uri, connection.ws, connection.state]);

  /** Handle manual disconnect */
  useEffect(() => {
    const close = createClose(dispatch);
    if (connection.state === ConnectionState.Closing && connection.ws) {
      close(connection.ws);
    }
  }, [connection.ws, connection.state]);

  /** Handle unmount */
  useEffect(() => {
    return () => {
      if (connection.ws) {
        connection.ws.close();
      }
    };
  }, [connection.ws]);

  return [connection, connect, disconnect];
};
