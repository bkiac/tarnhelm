import * as stream from '../../stream';
import { generateSalt } from '../utils';
import { KEY_LENGTH, generateKey, generateNonceBase, encrypt, decrypt } from './utils';

enum Mode {
  Encrypt,
  Decrypt,
}

/** Encrypted Content-Encoding Transformer */
type ECETransformer<I, O> = RequiredBy<Transformer<I, O>, 'transform'>;

interface EncoderParams {
  ikm: Uint8Array;
  recordSize: number;
}

interface CipherParams extends EncoderParams {
  salt: ArrayBuffer;
}

interface DecipherParams extends EncoderParams {
  ikm: Uint8Array;
}

interface Header {
  salt: ArrayBuffer;
  recordSize: number;
  length: number;
}

const TAG_LENGTH = 16;
export const RECORD_SIZE = 1024 * 64;

function createSlicer(
  mode: Mode,
  recordSize: number,
): RequiredBy<Transformer<Uint8Array, Uint8Array>, 'transform'> {
  let chunkSize = mode === Mode.Encrypt ? recordSize - 17 : 21;
  let partialChunk = new Uint8Array(chunkSize);
  let offset = 0;

  function enqueue(
    buffer: Uint8Array,
    controller: TransformStreamDefaultController<Uint8Array>,
  ): void {
    controller.enqueue(buffer);
    if (chunkSize === 21 && mode === Mode.Decrypt) {
      chunkSize = recordSize;
    }
    partialChunk = new Uint8Array(chunkSize);
    offset = 0;
  }

  const transform: TransformStreamDefaultControllerTransformCallback<Uint8Array, Uint8Array> = (
    chunk,
    controller,
  ) => {
    let i = 0;

    if (offset > 0) {
      const len = Math.min(chunk.byteLength, chunkSize - offset);
      partialChunk.set(chunk.slice(0, len), offset);
      offset += len;
      i += len;

      if (offset === chunkSize) {
        enqueue(partialChunk, controller);
      }
    }

    while (i < chunk.byteLength) {
      const remainingBytes = chunk.byteLength - i;
      if (remainingBytes >= chunkSize) {
        const record = chunk.slice(i, i + chunkSize);
        i += chunkSize;
        enqueue(record, controller);
      } else {
        const end = chunk.slice(i, i + remainingBytes);
        i += end.byteLength;
        partialChunk.set(end);
        offset = end.byteLength;
      }
    }
  };

  const flush: TransformStreamDefaultControllerCallback<Uint8Array> = (controller) => {
    if (offset > 0) {
      controller.enqueue(partialChunk.slice(0, offset));
    }
  };

  return { transform, flush };
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

  async function transformPrevChunk(isFinal: boolean, controller: Controller): Promise<void> {
    /** `prevChunk` will exist after the first transform call */
    if (prevChunk) {
      controller.enqueue(await encryptRecord(prevChunk, isFinal));
      i += 1;
    }
  }

  const start: ControllerCallback = (controller) => {
    controller.enqueue(writeHeader());
  };

  const transform: ControllerTransformCallback = async (chunk, controller) => {
    if (!isFirstChunk) await transformPrevChunk(false, controller);
    isFirstChunk = false;
    prevChunk = Buffer.from(chunk.buffer);
  };

  const flush: ControllerCallback = async (controller) => {
    if (prevChunk) {
      await transformPrevChunk(true, controller);
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
    for (let j = record.length; j > 0; j -= 1) {
      if (record[j]) {
        if (isFinal && record[j] !== 2) {
          throw new Error('Delimiter of final record is not 2.');
        }
        if (record[j] !== 1) {
          throw new Error('Delimiter of non-final record is not 1.');
        }
        return record.slice(0, j);
      }
    }
    throw new Error('No delimiter found.');
  }

  function readHeader(header: Buffer): Header {
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

  async function transformPrevChunk(isFinal: boolean, controller: Controller): Promise<void> {
    /** `prevChunk` will exist after the first transform call */
    if (prevChunk) {
      if (i === 0) {
        // The first chunk during decryption contains only the header
        const { salt } = readHeader(prevChunk);
        key = await generateKey(ikm, salt);
        ({ generateNonce } = await generateNonceBase(ikm, salt));
      } else {
        controller.enqueue(await decryptRecord(prevChunk, isFinal));
      }
      i += 1;
    }
  }

  const start: ControllerCallback = () => {};

  const transform: ControllerTransformCallback = async (chunk, controller) => {
    if (!isFirstChunk) await transformPrevChunk(false, controller);
    isFirstChunk = false;
    prevChunk = Buffer.from(chunk.buffer);
  };

  const flush: ControllerCallback = async (controller) => {
    if (prevChunk) {
      await transformPrevChunk(true, controller);
    }
  };

  return { start, transform, flush };
}

function slice(
  input: ReadableStream<Uint8Array>,
  options: { mode: Mode; recordSize: number },
): ReadableStream<Uint8Array> {
  const { mode, recordSize } = options;
  return stream.transform(input, createSlicer(mode, recordSize));
}

export async function encryptStream(
  plainstream: ReadableStream<Uint8Array>,
  params: PartialBy<CipherParams, 'recordSize' | 'salt'>,
): Promise<ReadableStream<Buffer>> {
  const { recordSize = RECORD_SIZE, ikm, salt = generateSalt(KEY_LENGTH) } = params;
  const sliced = slice(plainstream, { mode: Mode.Encrypt, recordSize });
  const cipher = await createCipher({ recordSize, ikm, salt });
  return stream.transform(sliced, cipher);
}

export function decryptStream(
  cipherstream: ReadableStream<Uint8Array>,
  params: DecipherParams & { recordSize?: number },
): ReadableStream<Buffer> {
  const { recordSize = RECORD_SIZE, ikm } = params;
  const sliced = slice(cipherstream, { mode: Mode.Decrypt, recordSize });
  const decipher = createDecipher({ recordSize, ikm });
  return stream.transform(sliced, decipher);
}
