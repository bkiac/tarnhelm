import * as WebSocket from 'ws';
import { omitBy } from 'lodash';

export function send(
  ws: WebSocket,
  message: {
    data?: SafeAny;
    error?: { status: number; reason: string | string[] };
  },
): void {
  return ws.send(JSON.stringify(omitBy(message)));
}
