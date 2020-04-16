/* eslint-disable no-console */
import io from 'socket.io';
import { v4 as uuid } from 'uuid';
import { Dictionary } from 'lodash';
import * as fs from 'fs';
import * as path from 'path';

const clients: Partial<Dictionary<io.Socket>> = {};
let clientStats = {
  current: 0,
  max: 0,
};

type SocketEvent = 'message' | 'disconnect' | 'upload';
type SocketEventHandler = (...args: any[]) => void;
type SocketEventHandlerCreator = (id: string) => SocketEventHandler;

function updateStats(): void {
  const current = Object.values(clients).reduce((sum, client) => (client ? sum + 1 : sum), 0);
  let { max } = clientStats;
  max = current > max ? current : max;
  clientStats = {
    current,
    max,
  };
}

function log(message: string, meta?: any): void {
  console.log(new Date(), message, meta);
}

function createUploadHandler(): SocketEventHandler {
  return function handle(file: any): void {
    const buffer = Buffer.from(file);
    log('File received');
    fs.createWriteStream(path.join(__dirname, 'file'), { flags: 'a' }).write(buffer);
  };
}

function createMessageHandler(id: string): SocketEventHandler {
  return function handle(message: string): void {
    log('Message received', { clientId: id, message });
  };
}

function createDisconnectionHandler(id: string): SocketEventHandler {
  return function handle(): void {
    clients[id] = undefined;
    updateStats();
    log('Client disconnected', { id, clientStats });
  };
}

function attachHandler(
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
  specs: [SocketEvent, SocketEventHandlerCreator][],
): io.Socket {
  specs.forEach(([event, handler]) => {
    attachHandler(client, event, handler(id));
  });
  return client;
}

export function handleConnection(client: io.Socket): io.Socket {
  const id = uuid();
  clients[id] = client;
  updateStats();
  log('Client connected', {
    id,
    clientStats,
  });
  return attachHandlers(id, client, [
    ['disconnect', createDisconnectionHandler],
    ['message', createMessageHandler],
    ['upload', createUploadHandler],
  ]);
}

export default function bind(httpServer: any, shouldHandleConnection = true): io.Server {
  const socket = io(httpServer);
  if (shouldHandleConnection) {
    socket.on('connection', handleConnection);
  }
  return socket;
}
