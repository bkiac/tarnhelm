/* eslint-disable no-console */
import io from 'socket.io';
import { v4 as uuid } from 'uuid';
import { Dictionary } from 'lodash';

const clients: Partial<Dictionary<io.Socket>> = {};
let maxClients = 0;

type SocketEvent = 'message' | 'disconnect';
type SocketEventHandler = (...args: any[]) => void;
type SocketEventValami = (id: string, client: io.Socket) => SocketEventHandler;

function log(message: string, meta?: any): void {
  console.log(new Date(), message, meta);
}

function handleMessage(id: string): SocketEventHandler {
  return function handle(message: string): void {
    log('Message received', { clientId: id, message });
  };
}

function handleDisconnect(id: string): SocketEventHandler {
  return function handle(): void {
    log('Client disconnected', { id });
  };
}

function attachHandler(
  id: string,
  client: io.Socket,
  event: SocketEvent,
  handler: SocketEventHandler,
): io.Socket {
  client.on(event, handler);
  return client;
}

function attachHandlers(
  id: string,
  client: io.Socket,
  specs: [SocketEvent, SocketEventValami][],
): io.Socket {
  specs.forEach(([event, handler]) => {
    attachHandler(id, client, event, handler(id, client));
  });
  return client;
}

export function handleConnection(client: io.Socket): io.Socket {
  const id = uuid();
  clients[id] = client;

  const currentClients = Object.keys(clients).length;
  maxClients = currentClients > maxClients ? currentClients : maxClients;

  log('Client connected', {
    id,
    clientStats: { max: maxClients, current: currentClients },
  });

  return attachHandlers(id, client, [
    ['disconnect', handleDisconnect],
    ['message', handleMessage],
  ]);
}

export default function bind(httpServer: any, shouldHandleConnection = true): io.Server {
  const socket = io(httpServer);
  if (shouldHandleConnection) {
    socket.on('connection', handleConnection);
  }
  return socket;
}
