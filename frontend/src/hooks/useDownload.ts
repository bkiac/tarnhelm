import { useCallback, useState, useEffect } from 'react';
import axios from 'axios';

import * as stream from '../lib/stream';
import * as crypto from '../lib/crypto';
import * as file from '../lib/file';

import ikm from '../ikm';

interface Progress {
  loading: boolean;
}

export default (defaultId?: string, decrypt?: boolean): [Progress, (id?: string) => void] => {
  const [id, setId] = useState(defaultId);

  const [loading, setLoading] = useState(false);

  const download = useCallback((newId?: string) => {
    if (newId) setId(newId);
    setLoading(true);
  }, []);

  useEffect(() => {
    setId(defaultId);
    setLoading(false);
  }, [defaultId]);

  /* Handle download */
  useEffect(() => {
    // TODO: Handle cancellation and failure
    (async (): Promise<void> => {
      if (id && loading) {
        const response = await axios.get(`/download/${id}`, {
          responseType: 'blob',
        });

        const blob = new Blob([response.data]);
        if (decrypt) {
          const decrypted = await stream.toArrayBuffer(
            crypto.ece.decryptStream(stream.createBlobStream(blob), {
              ikm,
            }),
          );
          console.log('DECRYPT');
          file.save(decrypted, { name: id });
        } else {
          console.log('NO DECRYPT');
          file.save(blob, { name: id });
        }

        setLoading(false);
      }
    })();
  }, [id, loading, decrypt]);

  return [{ loading }, download];
};
