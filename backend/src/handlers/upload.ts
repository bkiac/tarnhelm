import * as fs from 'fs';
import * as path from 'path';
import { WebsocketRequestHandler } from 'express-ws';

import { log } from '../lib/utils';

const upload: WebsocketRequestHandler = (ws) => {
  ws.once('message', (file) => {
    const buffer = Buffer.from(file);
    log('File received');
    fs.createWriteStream(path.join(__dirname, 'file'), { flags: 'a' }).write(buffer);
  });
};

export default upload;
