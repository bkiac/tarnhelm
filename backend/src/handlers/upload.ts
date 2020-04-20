import { createWebSocketStream } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';

import { log } from '../lib/utils';
import uploadToStorage from '../lib/upload';

const upload: WebsocketRequestHandler = (ws) => {
  ws.once('message', (fileName: string) => {
    const stream = createWebSocketStream(ws);

    stream.addListener('data', (chunk) => {
      log(`Received ${chunk.length} bytes of data.`);
      ws.send(chunk.length);
    });

    log('Start storage upload');
    uploadToStorage({ name: fileName, stream }).then((data) => {
      log('Finish storage upload', { data });
    });
  });
};

export default upload;
