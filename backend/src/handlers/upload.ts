import { createWebSocketStream } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';

import { log } from '../lib/utils';
import uploadToStorage from '../lib/upload';

const upload: WebsocketRequestHandler = (ws) => {
  ws.once('message', (fileName: string) => {
    const stream = createWebSocketStream(ws);
    log('Start storage upload');
    uploadToStorage({ name: fileName, stream }, (progress) => {
      const { loaded: uploaded } = progress;
      log(`Uploaded ${uploaded} bytes of data.`);
      ws.send(JSON.stringify({ uploaded }));
    }).then((data) => {
      log('Finish storage upload', { data });
    });
  });
};

export default upload;
