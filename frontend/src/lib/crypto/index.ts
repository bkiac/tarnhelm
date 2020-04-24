import * as stream from '../stream';

import { Mode, RECORD_SIZE } from './constants';
import * as generate from './generate';
import * as hkdf from './hkdf';
import StreamSlicer from './StreamSlicer';
import EncryptedContentEncodingTransformer from './ece/EncryptedContentEncodingTransformer';

function slice(
  input: ReadableStream,
  options: { mode: Mode; recordSize: number },
): ReadableStream<Uint8Array> {
  const { mode, recordSize } = options;
  return stream.transform(input, new StreamSlicer(mode, recordSize));
}

// Salt should be conditional based on Mode
/**
 * Key and noncebase generation is done in start and transform functions.
 * I would prefer to have them in the constructor,
 * I just need to setup `recordSize` and `salt` differently when mode is set to Decrypt.
 */
async function encode(
  input: ReadableStream,
  options: { mode: Mode; ikm: Uint8Array; recordSize: number; salt?: ArrayBuffer },
): Promise<ReadableStream> {
  const { mode, ikm, recordSize, salt } = options;

  const key = await hkdf.generateKey(ikm, {
    salt,
    info: 'aes128gcm',
  });

  return stream.transform(
    input,
    new EncryptedContentEncodingTransformer(mode, ikm, recordSize, salt),
  );
}

export async function encrypt(
  plainstream: ReadableStream,
  options: { ikm: Uint8Array; recordSize?: number; salt?: ArrayBuffer },
): Promise<ReadableStream> {
  const mode = Mode.Encrypt;
  const { ikm, recordSize = RECORD_SIZE, salt = generate.salt() } = options;
  const sliced = slice(plainstream, { mode, recordSize });
  return encode(sliced, { mode, ikm, recordSize, salt });
}

export async function decrypt(
  cipherstream: ReadableStream,
  options: { ikm: Uint8Array; recordSize?: number },
): Promise<ReadableStream> {
  const mode = Mode.Decrypt;
  const { ikm, recordSize = RECORD_SIZE } = options;
  const sliced = slice(cipherstream, { mode, recordSize });
  return encode(sliced, { mode, ikm, recordSize });
}
