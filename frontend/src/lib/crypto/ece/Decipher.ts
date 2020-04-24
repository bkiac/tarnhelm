import { Mode, TAG_LENGTH, KEY_LENGTH } from '../constants';
import * as hkdf from '../hkdf';
import * as generate from '../generate';
import EncryptedContentEncodingTransformer from './EncryptedContentEncodingTransformer';

type Controller = TransformStreamDefaultController<Uint8Array>;

export default class Decipher {
  private mode: Mode;

  private recordSize: number;
  private seq: number;
  private prevChunk?: Buffer;
  private isFirstChunk: boolean;

  private ikm: ArrayBuffer;
  private salt: ArrayBuffer;
  private nonceBase: Buffer;
  private key: CryptoKey;

  constructor(mode: Mode, recordSize: number, ikm: Uint8Array, salt: ArrayBuffer) {
    this.mode = mode;

    this.seq = 0;
    this.isFirstChunk = true;
    this.recordSize = recordSize;

    this.ikm = ikm.buffer;
    this.salt = salt;
  }

  private generateKey = async (): Promise<CryptoKey> =>
    hkdf.generateKey(this.ikm, { salt: this.salt, info: 'Content-Encoding: aes128gcm\0' });

  private generateNonceBase = async (): Promise<Buffer> =>
    generate.nonceBase(this.ikm, { salt: this.salt, info: 'Content-Encoding: nonce\0' });

  private generateNonce = (seq: number = this.seq): Buffer => generate.nonce(seq, this.nonceBase);

  /**
   * Un-pad a previously padded record.
   */
  private unpad = (buffer: Buffer, isFinal: boolean): Buffer => {
    for (let i = buffer.length; i > 0; i -= 1) {
      if (buffer[i]) {
        if (isFinal && buffer[i] !== 2) {
          throw new Error('Delimiter of final record is not 2');
        }
        if (buffer[i] !== 1) {
          throw new Error('Delimiter of non-final record is not 1');
        }
        return buffer.slice(0, i);
      }
    }
    throw new Error('No delimiter found');
  };

  private readHeader = (
    buffer: Buffer,
  ): { salt: ArrayBuffer; recordSize: number; length: number } => {
    if (buffer.length < 21) {
      throw new Error('chunk too small for reading header');
    }
    const salt = buffer.buffer.slice(0, KEY_LENGTH);
    const recordSize = buffer.readUIntBE(KEY_LENGTH, 4);
    const length = buffer.readUInt8(KEY_LENGTH + 4) + KEY_LENGTH + 5;
    return { salt, recordSize, length };
  };

  private decryptRecord = async (buffer: Buffer, isLast: boolean): Promise<Buffer> => {
    const nonce = this.generateNonce(this.seq - 1);
    const data = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce,
        tagLength: 128,
      },
      this.key,
      buffer,
    );
    return this.unpad(Buffer.from(data), isLast);
  };

  private start = async (): Promise<void> => {};

  private transformPrevChunk = async (isLast: boolean, controller: Controller): Promise<void> => {
    /** `prevChunk` will exist after the first transform call */
    if (this.prevChunk) {
      if (this.seq === 0) {
        // the first chunk during decryption contains only the header
        const header = this.readHeader(this.prevChunk);
        this.salt = header.salt;
        this.recordSize = header.recordSize;
        this.key = await this.generateKey();
        this.nonceBase = await this.generateNonceBase();
      } else {
        controller.enqueue(await this.decryptRecord(this.prevChunk, isLast));
      }
      this.seq += 1;
    }
  };

  private transform = async (chunk: Uint8Array, controller: Controller): Promise<void> => {
    if (!this.isFirstChunk) {
      await this.transformPrevChunk(false, controller);
    }
    this.isFirstChunk = false;
    this.prevChunk = Buffer.from(chunk.buffer);
  };

  private flush = async (controller: Controller): Promise<void> => {
    if (this.prevChunk) {
      await this.transformPrevChunk(true, controller);
    }
  };
}
