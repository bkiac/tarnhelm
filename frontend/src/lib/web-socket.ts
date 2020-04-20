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
