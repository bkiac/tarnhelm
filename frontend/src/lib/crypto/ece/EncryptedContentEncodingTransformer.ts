import { Mode } from '../constants';

export default interface EncryptedContentEncodingTransformer {
  mode: Mode;

  recordSize: number;
  seq: number;
  prevChunk?: Uint8Array;
  isFirstChunk: boolean;

  ikm: ArrayBuffer;
  salt: ArrayBuffer;
  nonceBase: Buffer;
  key: CryptoKey;

  generateKey: () => Promise<CryptoKey>;
  generateNonceBase: () => Promise<Buffer>;
  generateNonce: () => Buffer;
}
