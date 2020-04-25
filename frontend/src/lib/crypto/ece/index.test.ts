/* eslint-env jest */
import { encryptStream, decryptStream } from './index';
import * as stream from '../../stream';

describe('Encrypted Content-Encoding', () => {
  beforeAll(async () => {
    await page.goto('https://google.com');
  });

  test('encryption', async () => {
    const str = "Don't trust, verify.";
    const blob = new Blob([str], { type: 'text/plain' });
    const blobStream = stream.createBlobStream(blob);
    const plain = Buffer.from([]);
    stream.read(blobStream, (chunk) => {
      Buffer.concat([plain, chunk]);
    });

    const ikm = crypto.getRandomValues(new Uint8Array(16));

    const encryptedStream = await encryptStream(blobStream, { ikm });
    const decryptedStream = decryptStream(encryptedStream, { ikm });
    const decrypted = Buffer.from([]);
    stream.read(decryptedStream, (chunk) => {
      Buffer.concat([decrypted, chunk]);
    });

    expect(decrypted.equals(plain)).toBe(true);
  });
});
