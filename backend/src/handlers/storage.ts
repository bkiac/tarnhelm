import * as stream from 'stream';
import * as ws from 'ws';
import express from 'express';
import expressWs from 'express-ws';
import { v4 as uuid } from 'uuid';
import { isNil } from 'lodash';
import * as crypto from 'crypto';

import config from '../config';
import { log } from '../utils';
import * as storage from '../lib/storage';
import * as webSocket from '../lib/web-socket';

const storageConfig = config.get('storage');

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

interface UploadParams {
  metadata: string;
  authb64: string;
  size?: number;
  downloadLimit?: number;
  expiry?: number;
}

function validateUploadParams(params: UploadParams): string[] {
  const { metadata, authb64, size, downloadLimit, expiry } = params;

  const errors: string[] = [];

  const isTooBig = (value: number | undefined, max: number): boolean =>
    !isNil(value) && value > max;

  if (isNil(metadata)) errors.push('Metadata is empty.');
  if (isNil(authb64)) errors.push('Authentication key is empty.');
  if (isTooBig(size, storageConfig.fileSize.max))
    errors.push(`${size} is greater than ${storageConfig.fileSize.max}`);
  if (isTooBig(downloadLimit, storageConfig.downloads.max))
    errors.push(`${downloadLimit} is greater than ${storageConfig.downloads.max}`);
  if (isTooBig(expiry, storageConfig.expiry.max))
    errors.push(`${expiry} is greater than ${storageConfig.expiry.max}`);

  return errors;
}

export const upload: expressWs.WebsocketRequestHandler = (client) => {
  let fileStream: stream.Duplex | undefined;

  client.addEventListener('close', (event) => {
    if (event.code !== 1000 && fileStream) fileStream.destroy();
  });

  client.once('message', async (msg: string) => {
    const params = JSON.parse(msg) as UploadParams;
    const errors = validateUploadParams(params);
    if (errors.length > 0) {
      webSocket.send(client, { error: { status: 400, reason: errors } });
      return client.close();
    }

    const id = uuid();
    webSocket.send(client, { data: id });

    const { metadata, size, downloadLimit, expiry, authb64 } = params;

    fileStream = ws.createWebSocketStream(client).pipe(eof());
    log('Start storage upload', id);
    try {
      const data = await storage.set(
        { id, stream: fileStream, metadata, size },
        { downloadLimit, expiry, authb64 },
        (progress) => webSocket.send(client, { data: progress.loaded }),
      );
      log('Finish storage upload', data);
    } catch (e) {
      log('Storage error', { id, error: e as Error });
      fileStream.destroy();
      await storage.del(id);
      log('Temporary file deleted', id);
    }

    return client.close();
  });
};

export const download: express.RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const { authb64, nonce, downloads, downloadLimit } = await storage.getMetadata(id);

    if (downloads >= downloadLimit) {
      res.sendStatus(404);
      return;
    }

    const authHeader = req.header('Authorization')?.split(' ')[1];
    if (isNil(authHeader)) {
      res.sendStatus(401);
      return;
    }

    const hash = crypto
      .createHmac('sha256', Buffer.from(authb64, 'base64'))
      .update(Buffer.from(nonce, 'base64'))
      .digest();
    try {
      const authenticated = crypto.timingSafeEqual(hash, Buffer.from(authHeader, 'base64'));
      if (!authenticated) {
        res.sendStatus(401);
        return;
      }
    } catch (error) {
      res.sendStatus(401);
      return;
    }

    const newNonce = await storage.setNonce(id);
    res.set('WWW-Authenticate', `tarnhelm ${newNonce}`);

    const fileStream = await storage.get(id);

    let cancelled = false;
    let finished = false;

    log('Start storage download', id);
    fileStream
      .pipe(res)
      .on('finish', () => {
        if (!cancelled) {
          finished = true;
          storage.bumpDownloads(id).then(
            (newDownloads) => {
              if (newDownloads >= downloadLimit) {
                storage.del(id).then(
                  () => {
                    log('Finish storage download and delete file', id);
                  },
                  () => {},
                );
              }
              log('Finish storage download', id);
            },
            (err) => {
              log('Error during decreasing download limit', { id, err: err as Error });
            },
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
    res.sendStatus(404);
  }
};

export const getMetadata: express.RequestHandler<{ id: string }> = async (req, res) => {
  try {
    const { authb64, downloads, downloadLimit, ...metadata } = await storage.getMetadata(
      req.params.id,
    );

    if (downloads >= downloadLimit) {
      res.sendStatus(404);
      return;
    }

    res.send(metadata);
  } catch (error) {
    res.sendStatus(404);
  }
};
