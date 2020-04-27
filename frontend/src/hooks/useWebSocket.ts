import { useCallback, useEffect, useReducer, Reducer, Dispatch } from 'react';

import config from '../config';
import * as webSocket from '../lib/web-socket';

enum ConnectionStatus {
  Opening,
  Open,
  Closing,
  Closed,
}

interface Connection {
  loading: boolean;
  status: ConnectionStatus;
  ws?: WebSocket;
  error?: Error;
}

enum ActionType {
  ConnectPending,
  ConnectSuccess,
  ConnectFailure,
  DisconnectPending,
  DisconnectSuccess,
  DisconnectFailure,
}

type ConnectPending = ReducerAction<ActionType.ConnectPending>;
type ConnectSuccess = ReducerAction<ActionType.ConnectSuccess, { ws: WebSocket }>;
type ConnectFailure = ReducerAction<ActionType.ConnectFailure, { error: Error }>;
type DisconnectPending = ReducerAction<ActionType.DisconnectPending>;
type DisconnectSuccess = ReducerAction<ActionType.DisconnectSuccess>;
type DisconnectFailure = ReducerAction<ActionType.DisconnectFailure, { error: Error }>;

type ConnectionAction =
  | ConnectPending
  | ConnectSuccess
  | ConnectFailure
  | DisconnectPending
  | DisconnectSuccess
  | DisconnectFailure;

const reducer: Reducer<Connection, ConnectionAction> = (state, action) => {
  switch (action.type) {
    case ActionType.ConnectPending: {
      return {
        ...state,
        loading: true,
        status: ConnectionStatus.Opening,
      };
    }
    case ActionType.ConnectSuccess: {
      const { ws } = action.payload;
      return {
        loading: false,
        status: ConnectionStatus.Open,
        ws,
      };
    }
    case ActionType.ConnectFailure: {
      const { error } = action.payload;
      return {
        loading: false,
        status: ConnectionStatus.Closed,
        error,
      };
    }

    case ActionType.DisconnectPending: {
      return {
        ...state,
        loading: true,
        status: ConnectionStatus.Closing,
      };
    }
    case ActionType.DisconnectSuccess: {
      return {
        loading: false,
        status: ConnectionStatus.Closed,
      };
    }
    case ActionType.DisconnectFailure: {
      const { error } = action.payload;
      return {
        loading: false,
        status: ConnectionStatus.Open,
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

function createClose(dispatch: Dispatch<ConnectionAction>): (ws: WebSocket) => Promise<void> {
  return async function close(ws: WebSocket): Promise<void> {
    try {
      await webSocket.close(ws);
      dispatch({ type: ActionType.DisconnectSuccess });
    } catch (error) {
      dispatch({ type: ActionType.DisconnectFailure, payload: { error } });
    }
  };
}

function createOpen(
  currentWs: WebSocket | undefined,
  dispatch: Dispatch<ConnectionAction>,
): (uri: string) => Promise<void> {
  return async function open(uri: string): Promise<void> {
    try {
      if (currentWs) currentWs.close();
      const ws = await webSocket.open(config().uri.ws + uri);
      dispatch({ type: ActionType.ConnectSuccess, payload: { ws } });
    } catch (error) {
      dispatch({ type: ActionType.ConnectFailure, payload: { error } });
    }
  };
}

function init(options: Options): Connection {
  if (options.lazy) {
    return { status: ConnectionStatus.Closed, loading: false };
  }
  return {
    status: ConnectionStatus.Opening,
    loading: true,
  };
}

export default (
  uri = '',
  options: Options = { lazy: false },
): [Connection, () => void, () => void] => {
  const [connection, dispatch] = useReducer(reducer, init(options));

  const connect = useCallback(() => dispatch({ type: ActionType.ConnectPending }), []);
  const disconnect = useCallback(() => {
    if (connection.ws) {
      dispatch({ type: ActionType.DisconnectPending });
    }
  }, [connection.ws]);

  /** Handle mount, URI change and manual reconnect */
  useEffect(() => {
    const open = createOpen(connection.ws, dispatch);
    if (connection.status === ConnectionStatus.Opening) {
      open(uri);
    }
  }, [uri, connection.ws, connection.status]);

  /** Handle manual disconnect */
  useEffect(() => {
    const close = createClose(dispatch);
    if (connection.status === ConnectionStatus.Closing && connection.ws) {
      close(connection.ws);
    }
  }, [connection.ws, connection.status]);

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
