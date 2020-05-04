import isNil from 'lodash.isnil';

interface WebSocketError {
  status: number;
  reason: string[];
}

interface Response<D> {
  data?: D;
  error?: WebSocketError;
}

function parseResponse<D = any>(message: any): Response<D> {
  return JSON.parse(message) as Response<D>;
}

export async function open(uri: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(uri);
      ws.addEventListener('open', () => resolve(ws), { once: true });
    } catch (e) {
      reject(e);
    }
  });
}

export async function close(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      ws.addEventListener('close', () => resolve(), { once: true });
      ws.close();
    } catch (e) {
      reject(e);
    }
  });
}

export async function listen<T = any>(ws: WebSocket): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    ws.addEventListener(
      'message',
      (event) => {
        const res = parseResponse(event.data);
        if (!isNil(res.error)) reject(res.error);
        resolve(res.data);
      },
      { once: true },
    );
  });
}

export function addMessageListener<T = any>(
  ws: WebSocket,
  listener: (data: T, error?: WebSocketError) => void,
): void {
  ws.addEventListener('message', (event) => {
    const res = parseResponse(event.data);
    listener(res.data, !isNil(res.error) ? res.error : undefined);
  });
}
