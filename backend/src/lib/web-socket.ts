import * as WebSocket from 'ws';
import { pickBy } from 'lodash';

export function send(
  ws: WebSocket,
  message: {
    data?: SafeAny;
    error?: number;
  },
): void {
  return ws.send(JSON.stringify(pickBy(message)));
}
