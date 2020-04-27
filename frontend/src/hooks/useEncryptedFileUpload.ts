import { useMemo, useState } from 'react';

import useFileEncryption, { State as EncryptionState } from './useFileEncryption';
import useUploadStream, { State as UploadStreamState } from './useUploadStream';

export default (): [EncryptionState, UploadStreamState, (f: File) => void] => {
  const [file, setFile] = useState<File>();

  const encryption = useFileEncryption(file);

  const fileUpload = useMemo(() => {
    if (file && encryption.stream) {
      const { name, type, size } = file;
      return {
        stream: encryption.stream,
        metadata: {
          name,
          type,
          size,
        },
      };
    }
    return undefined;
  }, [file, encryption.stream]);

  const progress = useUploadStream(fileUpload);

  return [encryption, progress, setFile];
};
