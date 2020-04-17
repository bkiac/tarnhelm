import { WebsocketRequestHandler } from 'express-ws';

const upload: WebsocketRequestHandler = (ws, req) => {
  ws.once();
};

export default upload;
