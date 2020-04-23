import * as WebSocket from 'ws';
import { isString, isError } from 'lodash';

export function send(ws: WebSocket, message: string | object | Error): void {
  if (isString(message)) return ws.send(message);
  if (isError(message)) return ws.send(JSON.stringify({ error: message }));
  return ws.send(JSON.stringify({ data: message }));
}
