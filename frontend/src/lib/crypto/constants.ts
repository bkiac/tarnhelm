export const NONCE_LENGTH = 12;
export const TAG_LENGTH = 16;
export const KEY_LENGTH = 16;
export const RECORD_SIZE = 1024 * 64;
export const MAX_INT32 = 0xffffffff; // = (2^32) - 1 = 4294967295

export enum Mode {
  Encrypt,
  Decrypt,
}
