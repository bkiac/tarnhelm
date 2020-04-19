export default async (uri: string): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    try {
      const ws = new WebSocket(uri);
      ws.addEventListener('open', () => resolve(ws), { once: true });
    } catch (e) {
      reject(e);
    }
  });
};
