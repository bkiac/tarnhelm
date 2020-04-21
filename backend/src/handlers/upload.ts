import * as stream from 'stream';
import * as ws from 'ws';
import { WebsocketRequestHandler } from 'express-ws';
import bytes from 'bytes';

import { log } from '../lib/utils';
import uploadToStorage from '../lib/upload';

function eof(): stream.Transform {
  return new stream.Transform({
    transform(chunk, encoding, callback) {
      if (chunk.length === 1 && chunk[0] === 0) {
        this.push(null);
      } else {
        this.push(chunk);
      }
      callback();
    },
  });
}

const upload: WebsocketRequestHandler = (client) => {
  let fileStream: stream.Duplex;

  client.addEventListener('close', (event) => {
    if (event.code !== 1000 && fileStream) {
      fileStream.destroy();
    }
  });

  client.once('message', (fileName: string) => {
    fileStream = ws.createWebSocketStream(client).pipe(eof());
    log('Start storage upload');
    uploadToStorage({ name: fileName, stream: fileStream }, (progress) => {
      const { loaded: uploaded } = progress;
      log(`Uploaded ${bytes(uploaded)} of ${fileName}.`);
      client.send(JSON.stringify({ uploaded }));
    }).then((data) => {
      log('Finish storage upload', data);
      client.close();
    });
  });
};

export default upload;
