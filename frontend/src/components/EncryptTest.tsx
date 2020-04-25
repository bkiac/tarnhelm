import React, { useState, useEffect, ReactElement } from 'react';

import * as crypto from '../lib/crypto';
import * as stream from '../lib/stream';

export default (): ReactElement => {
  const [start, setStart] = useState(false);

  useEffect(() => {
    (async () => {
      if (start) {
        const str = "Don't trust, verify.";
        const blob = new Blob([str], { type: 'text/plain' });
        const plain = Buffer.from([]);
        await stream.read(stream.createBlobStream(blob), (chunk) => {
          console.log('Reading chunk', chunk);
          Buffer.concat([plain, Buffer.from(chunk)]);
        });
        console.log(plain);

        const ikm = crypto.getRandomValues(new Uint8Array(16));

        const encryptedStream = await crypto.encryptStream(stream.createBlobStream(blob), { ikm });
        console.log('\n');
        const decryptedStream = crypto.decryptStream(encryptedStream, { ikm });
        const decrypted = Buffer.from([]);
        await stream.read(decryptedStream, (chunk) => {
          console.log('Reading chunk', chunk);
          Buffer.concat([decrypted, Buffer.from(chunk)]);
        });

        console.log(decrypted);
      }
    })();
  }, [start]);

  return (
    <button type="button" onClick={() => setStart((s) => !s)}>
      Test
    </button>
  );
};
