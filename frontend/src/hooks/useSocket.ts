import { useMemo } from 'react';
import io from 'socket.io-client';

let socket: SocketIOClient.Socket | undefined;

const SERVER_URI = process.env.REACT_APP_SERVER_URI;

export default function useSocket(): [SocketIOClient.Socket, true] | [undefined, false] {
  return useMemo(() => {
    if (socket) {
      return [socket, true];
    }

    if (SERVER_URI) {
      socket = io(SERVER_URI);
      return [socket, true];
    }

    // eslint-disable-next-line no-console
    console.warn('WebSocket Server URL is undefined!');
    return [undefined, false];
  }, []);
}
