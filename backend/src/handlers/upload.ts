import { createWebSocketStream } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';

import { log } from '../lib/utils';
import uploadToStorage from '../lib/upload';

const upload: WebsocketRequestHandler = (ws) => {
  ws.once('message', (fileName: string) => {
    log('File received', fileName);
    const inc = createWebSocketStream(ws);
    log('Start DO upload');
    uploadToStorage({ name: fileName, stream: inc }).then((data) => {
      log('Finish DO upload', { data });
    });
  });
};

export default upload;
