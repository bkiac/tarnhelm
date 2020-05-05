import * as stream from 'stream';
import * as crypto from 'crypto';
import { isNil, Dictionary } from 'lodash';

import config from '../../config';
import * as s3 from './s3';
import * as redis from './redis';
import { log } from '../../utils';

const storageConfig = config.get('storage');

function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

interface StorageMetadata extends Dictionary<string | number> {
  downloadLimit: number;
  downloads: number;
  authb64: string;
  nonce: string;
  encryptedContentMetadata: string;
}

export async function getMetadata(id: string): Promise<StorageMetadata> {
  const res = (await redis.hgetall(id)) as StorageMetadata;
  if (isNil(res)) throw new Error(`Metadata with id "${id}" does not exist.`);
  return res;
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

  await redis.hmset(id, {
    downloadLimit,
    downloads: 0,
    authb64,
    nonce: generateNonce(),
    encryptedContentMetadata: metadata,
  });
  await redis.expire(id, expiry);

  return s3.set({ key: id, body: file.stream, length: size }, listener);
}

export async function isAvailable(id: string): Promise<boolean> {
  try {
    const { downloads, downloadLimit } = await getMetadata(id);
    return downloads < downloadLimit;
  } catch (error) {
    return false;
  }
}

export async function get(id: string): Promise<ReturnType<typeof s3.get>> {
  const available = await isAvailable(id);
  if (!available) throw new Error(`File with id "${id}" is not available.`);
  return s3.get(id);
}

export async function del(id: string): ReturnType<typeof s3.del> {
  await redis.del(id);
  return s3.del(id);
}

export async function bumpDownloads(id: string): Promise<number> {
  return redis.hincrby(id, 'downloads', 1);
}

export async function setNonce(id: string, nonce = generateNonce()): Promise<string> {
  await redis.hset(id, { nonce });
  return nonce;
}

export async function clean(): Promise<void> {
  // TODO: handle more than 1000 files
  const files = await s3.list();
  const keys = files.Contents?.map((fileObject) => fileObject.Key).filter<string>(
    (key): key is string => !isNil(key),
  );
  if (keys) {
    log(`There are ${keys.length} files in S3.`);
    const ttls = await Promise.all(keys.map(async (key) => redis.ttl(key)));
    const keysToDelete = ttls.reduce<string[]>((acc, ttl, i) => {
      if (ttl <= 0) acc.push(keys[i]);
      return acc;
    }, []);
    if (keysToDelete.length > 0) {
      log(`Deleting ${keysToDelete.length} unavailable files.`);
      await s3.delMany(keysToDelete);
    } else {
      log('There are no unavailable files.');
    }
  } else {
    log('There are no unavailable files.');
  }
}
