import io from 'socket.io';

export type WebSocketIncomingData = undefined | string | ArrayBuffer;

export type WebSocketEvent = 'disconnect' | 'upload';

export type WebSocketEventListener<T extends WebSocketIncomingData = string> = (data: T) => void;

export interface WebSocketEventContext {
  id: string;
  client: io.Socket;
}

export type WebSocketEventHandler<T extends WebSocketIncomingData = string> = (
  data: T,
  context: WebSocketEventContext,
) => void;
