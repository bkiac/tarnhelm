/* eslint-disable no-console */
import { createContext } from 'react';

function error(): void {
  console.error('WebSocketProvider is not found!');
}

const WebSocketContext = createContext<WebSocketContext>({
  connections: {},
  connect: () => {
    error();
    return { loading: true };
  },
  close: () => {
    error();
  },
});

export default WebSocketContext;
