import { useState, useMemo, useEffect } from 'react';
import isNil from 'lodash.isnil';

import * as base64 from '../lib/base64';
import * as crypto from '../lib/crypto';

type Sign = (nonceb64: string) => Promise<string>;
type EncryptMetadata = <M extends Record<string, any>>(metadata: M) => Promise<ArrayBuffer>;
type DecryptMetadata = <M extends Record<string, any>>(metadata: ArrayBuffer) => Promise<M>;
type EncryptStream = (stream: ReadableStream<Uint8Array>) => Promise<ReadableStream<Buffer>>;
type DecryptStream = (stream: ReadableStream<Uint8Array>) => ReadableStream<Buffer>;

interface Keyring {
  secretb64: string;
  authb64: string;
  sign: Sign;
  encryptMetadata: EncryptMetadata;
  decryptMetadata: DecryptMetadata;
  encryptStream: EncryptStream;
  decryptStream: DecryptStream;
}

export default function useKeyring(secretb64?: string): Keyring | undefined {
  const secret = useMemo(
    () => (isNil(secretb64) ? crypto.ece.generateIKM() : base64.toArray(secretb64)),
    [secretb64],
  );

  const [keyring, setKeyring] = useState<Keyring | undefined>();
  useEffect(() => {
    (async () => {
      const _secretb64 = base64.fromArray(secret);

      const authKey = await crypto.ece.generateAuthenticationKey(new Uint8Array(), secret);
      const authb64 = base64.fromArray(new Uint8Array(await crypto.ece.exportKey(authKey)));

      const metadataKey = await crypto.ece.generateMetadataEncryptionKey(new Uint8Array(), secret);

      const sign: Sign = async (nonceb64) => {
        const signature = await crypto.ece.sign(authKey, base64.toArray(nonceb64));
        return `tarnhelm ${base64.fromArray(new Uint8Array(signature))}`;
      };

      const encryptMetadata: EncryptMetadata = async (metadata) => {
        const encodedMetadata = new TextEncoder().encode(JSON.stringify(metadata));
        return crypto.ece.encrypt(new Uint8Array(12), metadataKey, encodedMetadata);
      };
      const decryptMetadata: DecryptMetadata = async <M extends Record<string, any>>(
        metadata: ArrayBuffer,
      ) => {
        const plaintext = await crypto.ece.decrypt(new Uint8Array(12), metadataKey, metadata);
        return JSON.parse(new TextDecoder().decode(plaintext)) as M;
      };

      const encryptStream: EncryptStream = async (stream) =>
        crypto.ece.encryptStream(crypto.ece.generateSalt(), secret, stream);
      const decryptStream: DecryptStream = (stream) => crypto.ece.decryptStream(secret, stream);

      setKeyring({
        secretb64: _secretb64,
        authb64,
        sign,
        encryptMetadata,
        decryptMetadata,
        encryptStream,
        decryptStream,
      });
    })();
  }, [secret]);

  return keyring;
}
