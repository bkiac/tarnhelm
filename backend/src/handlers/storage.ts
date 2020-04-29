import * as stream from 'stream';
import * as ws from 'ws';
import express from 'express';
import expressWs from 'express-ws';
import bytes from 'bytes';
import { v4 as uuid } from 'uuid';

import { log } from '../utils';
import * as storage from '../lib/storage';
import * as webSocket from '../lib/web-socket';

function eof(): stream.Transform {
  return new stream.Transform({
    transform(chunk: Buffer, encoding, callback) {
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
  let fileStream: stream.Duplex | undefined;

  client.addEventListener('close', (event) => {
    if (event.code !== 1000 && fileStream) {
      fileStream.destroy();
    }
  });

  client.once('message', (msg: string) => {
    const { name, type, size } = JSON.parse(msg) as { name: string; type: string; size: number };

    const id = `${uuid()}:${name}`;
    webSocket.send(client, { id });

    fileStream = ws.createWebSocketStream(client).pipe(eof());
    log('Start storage upload', { name, type, size });
    storage
      .set({ key: id, body: fileStream }, (progress) => {
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
          fileStream?.destroy();
          storage.del(id).then(
            () => {
              log('Temporary file deleted');
            },
            () => {},
          );
        },
      );
  });
};

export const download: express.RequestHandler<{ id: string }> = (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    log('Start storage download', id);
    const fileStream = storage.get(id);

    let cancelled = false;
    let finished = false;

    fileStream
      .pipe(res)
      .on('finish', () => {
        if (!cancelled) {
          finished = true;
          storage.del(id).then(
            () => {
              log('Finish storage download and delete file', id);
            },
            () => {},
          );
        }
      })
      .on('close', () => {
        if (!finished) {
          cancelled = true;
          log('Storage download error', id);
          fileStream.destroy();
        }
      });
  } catch (error) {
    res.status(404);
    res.send(error);
  }
};
