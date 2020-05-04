import * as stream from 'stream';
import * as crypto from 'crypto';
import { isNil } from 'lodash';

import config from '../../config';
import * as s3 from './s3';
import * as redis from './redis';

const storageConfig = config.get('storage');

interface StorageMetadata {
  downloadLimit: number;
  authb64: string;
  nonce: string;
  encryptedContentMetadata: string;
}

interface ParsedStorageMetadata {
  d: number;
  a: string;
  n: string;
  c: string;
}

function stringifyMetadata(metadata: StorageMetadata): string {
  const { downloadLimit, authb64, nonce, encryptedContentMetadata } = metadata;
  return JSON.stringify({
    d: downloadLimit,
    a: authb64,
    n: nonce,
    c: encryptedContentMetadata,
  });
}

function parseMetadata(metadataString: string): StorageMetadata {
  const { d, a, n, c } = JSON.parse(metadataString) as ParsedStorageMetadata;
  return {
    downloadLimit: d,
    authb64: a,
    nonce: n,
    encryptedContentMetadata: c,
  };
}

export async function setMetadata(
  id: string,
  metadata: StorageMetadata,
  expiry?: number,
): Promise<void> {
  await redis.set(id, stringifyMetadata(metadata), !isNil(expiry) ? { EX: expiry } : undefined);
}

export async function getMetadata(id: string): Promise<StorageMetadata> {
  try {
    const res = await redis.get(id);
    if (isNil(res)) throw new Error(`Metadata with id ${id} does not exist.`);
    return parseMetadata(res);
  } catch (err) {
    throw new Error((err as Error).message);
  }
}

export interface StorageUploadArgs {
  id: string;
  stream: stream.Readable;
  metadata: string;
  size?: number;
}

export interface StorageUploadOptions {
  authb64: string;
  downloadLimit?: number;
  expiry?: number; // in seconds
}

export async function set(
  file: StorageUploadArgs,
  options: StorageUploadOptions,
  listener?: s3.S3UploadListener,
): ReturnType<typeof s3.set> {
  const { id, metadata, size } = file;
  const {
    expiry = storageConfig.expiry.def,
    downloadLimit = storageConfig.downloads.def,
    authb64,
  } = options;

  const nonce = crypto.randomBytes(16).toString('base64');
  await setMetadata(
    id,
    {
      downloadLimit,
      authb64,
      nonce,
      encryptedContentMetadata: metadata,
    },
    expiry,
  );

  return s3.set({ key: id, body: file.stream, length: size }, listener);
}

export async function exists(id: string): Promise<boolean> {
  const [result] = await redis.exists(id);
  return result;
}

export async function existsMany(ids: string[]): Promise<boolean[]> {
  return redis.exists(...ids);
}

export async function get(id: string): Promise<ReturnType<typeof s3.get>> {
  const fileExists = await exists(id);
  if (!fileExists) throw new Error(`File does not exist with id ${id}.`);
  return s3.get(id);
}

export async function del(id: string): ReturnType<typeof s3.del> {
  await redis.del(id);
  return s3.del(id);
}

export async function delMany(ids: string[]): ReturnType<typeof s3.delMany> {
  await redis.del(...ids);
  return s3.delMany(...ids);
}

export async function decreaseDownloadLimit(id: string): Promise<number> {
  const { downloadLimit, ...restOfMetadata } = await getMetadata(id);
  const newDownloadLimit = downloadLimit - 1;
  if (newDownloadLimit === 0) {
    await del(id);
  } else {
    await setMetadata(id, { ...restOfMetadata, downloadLimit: newDownloadLimit });
  }
  return newDownloadLimit;
}
