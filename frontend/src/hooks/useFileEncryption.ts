import { useState, useEffect } from 'react';

import * as stream from '../lib/stream';
import * as crypto from '../lib/crypto';
import * as base64 from '../lib/base64';

export interface State {
  loading: boolean;
  stream?: ReadableStream<Buffer>;
  size?: number;
  secret?: {
    raw: Uint8Array;
    b64: string;
  };
}

export default function useFileEncryption(file?: File): State {
  const [state, setState] = useState<State>({
    loading: false,
  });

  useEffect(() => {
    (async () => {
      if (file) {
        setState({ loading: true });

        const rawSecret = crypto.ece.generateIKM();
        const encrypted = await crypto.ece.encryptStream(stream.createFileStream(file), {
          ikm: rawSecret,
        });

        setState({
          size: crypto.ece.calculateEncryptedSize(file.size),
          loading: false,
          stream: encrypted,
          secret: { raw: rawSecret, b64: base64.toBase64(rawSecret) },
        });
      }
    })();
  }, [file]);

  return state;
}
