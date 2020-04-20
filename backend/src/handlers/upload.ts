import * as fs from 'fs';
import * as path from 'path';
import { createWebSocketStream } from 'ws';
import { WebsocketRequestHandler } from 'express-ws';
import { v4 as uuid } from 'uuid';

import { log } from '../lib/utils';

const upload: WebsocketRequestHandler = (ws) => {
  ws.once('message', (fileName: string) => {
    log('File received', fileName);
    const inc = createWebSocketStream(ws);
    const out = fs.createWriteStream(
      path.join(__dirname, '..', '..', 'uploads', `${uuid()}:${fileName}`),
    );
    inc.pipe(out);
  });
};

export default upload;
