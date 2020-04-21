export function open(uri: string): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(uri);
      ws.addEventListener('open', () => resolve(ws), { once: true });
    } catch (e) {
      reject(e);
    }
  });
}

export function close(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      ws.addEventListener('close', () => resolve(), { once: true });
      ws.close();
    } catch (e) {
      reject(e);
    }
  });
}

export function listen<T = any>(ws: WebSocket): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    ws.addEventListener(
      'message',
      (event) => {
        try {
          const response = JSON.parse(event.data);
          if (response.error) {
            throw new Error(response.error);
          }
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      },
      { once: true },
    );
  });
}
