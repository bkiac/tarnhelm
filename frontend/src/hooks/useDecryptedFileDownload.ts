import { useCallback, useState, useEffect } from 'react';

import * as stream from '../lib/stream';
import * as file from '../lib/file';
import { isAnyLoading } from '../utils';
import useBlobDownload from './useBlobDownload';
import useFileDecryption from './useFileDecryption';

interface Progress {
  loading: boolean;
}

interface Args {
  id: string;
  secret: string;
}

type DownloadFn = (id: string, secret: string) => void;

export default (): [Progress, DownloadFn] => {
  const [args, setArgs] = useState<Args>();

  const download = useCallback<DownloadFn>((id, secret) => {
    setArgs({ id, secret });
  }, []);

  const { loading: downloading, data: blob } = useBlobDownload(args?.id);
  const { loading: decrypting, data: plaintext } = useFileDecryption(blob, args?.secret);

  const loading = isAnyLoading(downloading, decrypting);

  useEffect(() => {
    (async () => {
      // TODO: Handle cancellation and failure
      if (args && !loading && plaintext) {
        file.save(await stream.toArrayBuffer(plaintext), { name: args.id });
      }
    })();
  }, [args, loading, plaintext]);

  return [{ loading: isAnyLoading(loading, downloading, decrypting) }, download];
};
