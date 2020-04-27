import * as stream from 'stream';
import * as ws from 'ws';
import express from 'express';
import expressWs from 'express-ws';
import bytes from 'bytes';
import { v4 as uuid } from 'uuid';

import { log } from '../lib/utils';
import * as storage from '../lib/storage';
import * as webSocket from '../lib/web-socket';

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

export const upload: expressWs.WebsocketRequestHandler = (client) => {
  let fileStream: stream.Duplex;

  client.addEventListener('close', (event) => {
    if (event.code !== 1000 && fileStream) {
      fileStream.destroy();
    }
  });

  client.once('message', (msg: string) => {
    const { name, type, size }: { name: string; type: string; size: number } = JSON.parse(msg);

    const id = `${uuid()}:${name}`;
    webSocket.send(client, { id });

    fileStream = ws.createWebSocketStream(client).pipe(eof());
    log('Start storage upload', { name, type, size });
    storage
      .set({ key: id, body: fileStream, length: size }, (progress) => {
        const { loaded: uploaded } = progress;
        log(`Uploaded ${bytes(uploaded)} of ${bytes(size)}, ${name}.`);
        webSocket.send(client, { uploaded });
      })
      .then(
        (data) => {
          log('Finish storage upload', data);
          client.close();
        },
        (error) => {
          log('Storage error', error);
          client.close();
          fileStream.destroy();
          storage.del(id);
        },
      );
  });
};

export const download: express.RequestHandler<{ id: string }> = (req, res) => {
  try {
    const fileStream = storage.get(req.params.id);
    req.on('close', () => {
      fileStream.destroy();
    });
    fileStream.pipe(res);
  } catch (error) {
    res.status(404);
    res.send(error);
  }
};
