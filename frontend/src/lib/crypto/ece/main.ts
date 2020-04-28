import isNil from 'lodash.isnil';

import * as stream from '../../stream';
import { generateKey } from './key';
import { KEY_LENGTH, TAG_LENGTH, RECORD_SIZE, Mode } from './constants';
import generateNonceBase from './nonce';
import slice from './slice';
import { generateSalt } from './generate';

/** Encrypted Content-Encoding Transformer */
type ECETransformer<I, O> = RequiredBy<Transformer<I, O>, 'transform'>;

interface ECEParams {
  ikm: Uint8Array;
  recordSize: number;
}

interface CipherParams extends ECEParams {
  salt: ArrayBuffer;
}

interface DecipherParams extends ECEParams {
  ikm: Uint8Array;
}

interface ECEHeader {
  salt: ArrayBuffer;
  recordSize: number;
  length: number;
}

export async function encrypt(iv: Buffer, key: CryptoKey, plaintext: Buffer): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
}

export async function decrypt(
  iv: Buffer,
  key: CryptoKey,
  ciphertext: Buffer,
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    ciphertext,
  );
}

async function createCipher(args: CipherParams): Promise<ECETransformer<Uint8Array, Buffer>> {
  type Controller = TransformStreamDefaultController<Buffer>;
  type ControllerCallback = TransformStreamDefaultControllerCallback<Buffer>;
  type ControllerTransformCallback = TransformStreamDefaultControllerTransformCallback<
    Uint8Array,
    Buffer
  >;

  const {
    recordSize,
    salt,
    ikm: { buffer: ikm },
  } = args;

  let i = 0;
  let prevChunk: Buffer | undefined;
  let isFirstChunk = true;

  const key = await generateKey(ikm, salt);
  const { generateNonce } = await generateNonceBase(ikm, salt);

  /**
   * Pad records so all of them will have the same length.
   */
  function pad(record: Buffer, isFinal: boolean): Buffer {
    const { length } = record;
    if (length + TAG_LENGTH >= recordSize) {
      throw new Error(`Buffer too large for record size: ${length + TAG_LENGTH} >= ${recordSize}`);
    }

    if (isFinal) {
      const padding = Buffer.alloc(1);
      padding.writeUInt8(2, 0); // Use delimiter 2 for final record
      return Buffer.concat([record, padding]);
    }

    const padding = Buffer.alloc(recordSize - length - TAG_LENGTH);
    padding.fill(0);
    padding.writeUInt8(1, 0); // Use delimiter 1 for non-final record
    return Buffer.concat([record, padding]);
  }

  /**
   * Prepend salt and record size to the stream.
   */
  function writeHeader(): Buffer {
    const nums = Buffer.alloc(5);
    nums.writeUIntBE(recordSize, 0, 4);
    nums.writeUIntBE(0, 4, 1);
    return Buffer.concat([Buffer.from(salt), nums]);
  }

  async function encryptRecord(record: Buffer, isFinal: boolean): Promise<Buffer> {
    const nonce = generateNonce(i);
    const ciphertext = await encrypt(nonce, key, pad(record, isFinal));
    return Buffer.from(ciphertext);
  }

  async function transformPrevChunk(
    chunk: Buffer,
    isFinal: boolean,
    controller: Controller,
  ): Promise<void> {
    const encrypted = await encryptRecord(chunk, isFinal);
    controller.enqueue(encrypted);
    i += 1;
  }

  const start: ControllerCallback = (controller) => {
    controller.enqueue(writeHeader());
  };

  const transform: ControllerTransformCallback = async (chunk, controller) => {
    if (!isFirstChunk && !isNil(prevChunk)) await transformPrevChunk(prevChunk, false, controller);
    isFirstChunk = false;
    prevChunk = Buffer.from(chunk.buffer);
  };

  const flush: ControllerCallback = async (controller) => {
    if (prevChunk) {
      await transformPrevChunk(prevChunk, true, controller);
    }
  };

  return { start, transform, flush };
}

function createDecipher(args: DecipherParams): ECETransformer<Uint8Array, Buffer> {
  type Controller = TransformStreamDefaultController<Buffer>;
  type ControllerCallback = TransformStreamDefaultControllerCallback<Buffer>;
  type ControllerTransformCallback = TransformStreamDefaultControllerTransformCallback<
    Uint8Array,
    Buffer
  >;

  const {
    ikm: { buffer: ikm },
  } = args;

  let i = 0;
  let prevChunk: Buffer | undefined;
  let isFirstChunk = true;

  let generateNonce: (seq: number) => Buffer;
  let key: CryptoKey;

  /**
   * Un-pad a padded record.
   */
  function unpad(record: Buffer, isFinal: boolean): Buffer {
    for (let j = record.length - 1; j >= 0; j--) {
      const byte = record[j];
      if (byte !== 0) {
        if (isFinal && byte !== 2) {
          throw new Error('Delimiter of final record is not 2.');
        }
        if (!isFinal && byte !== 1) {
          throw new Error('Delimiter of non-final record is not 1.');
        }
        return record.slice(0, j);
      }
    }
    throw new Error('No delimiter found.');
  }

  function readHeader(header: Buffer): ECEHeader {
    if (header.length < 21) {
      throw new Error('Chunk too small for reading header.');
    }
    const salt = header.buffer.slice(0, KEY_LENGTH);
    const rs = header.readUIntBE(KEY_LENGTH, 4);
    const length = header.readUInt8(KEY_LENGTH + 4) + KEY_LENGTH + 5;
    return { salt, recordSize: rs, length };
  }

  async function decryptRecord(record: Buffer, isFinal: boolean): Promise<Buffer> {
    const nonce = generateNonce(i - 1);
    const plaintext = await decrypt(nonce, key, record);
    return unpad(Buffer.from(plaintext), isFinal);
  }

  async function transformPrevChunk(
    chunk: Buffer,
    isFinal: boolean,
    controller: Controller,
  ): Promise<void> {
    if (i === 0) {
      // The first chunk during decryption contains only the header
      const header = readHeader(chunk);
      key = await generateKey(ikm, header.salt);
      ({ generateNonce } = await generateNonceBase(ikm, header.salt));
    } else {
      controller.enqueue(await decryptRecord(chunk, isFinal));
    }
    i += 1;
  }

  const start: ControllerCallback = () => {};

  const transform: ControllerTransformCallback = async (chunk, controller) => {
    if (!isFirstChunk && !isNil(prevChunk)) await transformPrevChunk(prevChunk, false, controller);
    isFirstChunk = false;
    prevChunk = Buffer.from(chunk.buffer);
  };

  const flush: ControllerCallback = async (controller) => {
    if (prevChunk) {
      await transformPrevChunk(prevChunk, true, controller);
    }
  };

  return { start, transform, flush };
}

export async function encryptStream(
  plainstream: ReadableStream<Uint8Array>,
  params: PartialBy<CipherParams, 'recordSize' | 'salt'>,
): Promise<ReadableStream<Buffer>> {
  const { recordSize = RECORD_SIZE, ikm, salt = generateSalt() } = params;
  const sliced = slice(plainstream, { mode: Mode.Encrypt, recordSize });
  const cipher = await createCipher({ recordSize, ikm, salt });
  return stream.transform(sliced, cipher);
}

export function decryptStream(
  cipherstream: ReadableStream<Uint8Array>,
  params: PartialBy<DecipherParams, 'recordSize'>,
): ReadableStream<Buffer> {
  const { recordSize = RECORD_SIZE, ikm } = params;
  const sliced = slice(cipherstream, { mode: Mode.Decrypt, recordSize });
  const decipher = createDecipher({ recordSize, ikm });
  return stream.transform(sliced, decipher);
}
