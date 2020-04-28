import { useMemo, useState, useEffect } from 'react';

import * as stream from '../lib/stream';
import * as crypto from '../lib/crypto';
import * as base64 from '../lib/base64';
import useLoadableResult from './useLoadableResult';

export default (blob?: Blob, secret?: string): LoadableResult<ReadableStream<Uint8Array>> => {
  const [loading, setLoading] = useState(false);
  const [plaintext, setPlaintext] = useState<ReadableStream<Uint8Array>>();

  const ikm = useMemo(() => secret && base64.toArray(secret), [secret]);

  useEffect(() => {
    if (blob && ikm) {
      setLoading(true);

      setPlaintext(
        crypto.ece.decryptStream(stream.createBlobStream(blob), {
          ikm,
        }),
      );

      setLoading(false);
    }
  }, [blob, ikm]);

  return useLoadableResult(loading, plaintext);
};
