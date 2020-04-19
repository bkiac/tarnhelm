import { WebsocketRequestHandler } from 'express-ws';

import { log } from '../lib/utils';

const reverse: WebsocketRequestHandler = (ws) => {
  ws.on('message', (msg: string) => {
    log('Message received', { msg });
    ws.send(Array.from(msg).reverse().join(''));
  });
};

export default reverse;
