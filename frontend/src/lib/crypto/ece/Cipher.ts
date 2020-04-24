import { Mode, TAG_LENGTH } from '../constants';
import * as hkdf from '../hkdf';
import * as generate from '../generate';
import EncryptedContentEncodingTransformer from './EncryptedContentEncodingTransformer';

type Controller = TransformStreamDefaultController<Uint8Array>;

export default class Cipher {
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
   * Pad records so all of them will have the same length.
   */
  private pad = (buffer: Buffer, isFinal: boolean): Buffer => {
    const { length } = buffer;
    if (length + TAG_LENGTH >= this.recordSize) {
      throw new Error(
        `Buffer too large for record size: ${length + TAG_LENGTH} >= ${this.recordSize}`,
      );
    }

    if (isFinal) {
      const padding = Buffer.alloc(1);
      padding.writeUInt8(2, 0); // Use delimiter 2 for final record
      return Buffer.concat([buffer, padding]);
    }

    const padding = Buffer.alloc(this.recordSize - length - TAG_LENGTH);
    padding.fill(0);
    padding.writeUInt8(1, 0); // Use delimiter 1 for non-final record
    return Buffer.concat([buffer, padding]);
  };

  private writeHeader = (): Buffer => {
    const nums = Buffer.alloc(5);
    nums.writeUIntBE(this.recordSize, 0, 4);
    nums.writeUIntBE(0, 4, 1);
    return Buffer.concat([Buffer.from(this.salt), nums]);
  };

  private encryptRecord = async (buffer: Buffer, isLast: boolean): Promise<Buffer> => {
    const nonce = this.generateNonce();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce },
      this.key,
      this.pad(buffer, isLast),
    );
    return Buffer.from(encrypted);
  };

  private start = async (controller: Controller): Promise<void> => {
    this.key = await this.generateKey();
    this.nonceBase = await this.generateNonceBase();
    controller.enqueue(this.writeHeader());
  };

  private transformPrevChunk = async (isLast: boolean, controller: Controller): Promise<void> => {
    /** `prevChunk` will exist after the first transform call */
    if (this.prevChunk) {
      controller.enqueue(await this.encryptRecord(this.prevChunk, isLast));
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
