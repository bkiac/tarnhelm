interface Connection {
  ws?: WebSocket;
  loading: boolean;
  error?: Error;
}

interface Connections {
  [key: string]: Connection;
}

interface WebSocketContext {
  connections: Partial<Connections>;
  connect: (uri: string) => Connection;
  close: (uri: string) => void;
}
