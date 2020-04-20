import { useEffect, useState, useCallback } from 'react';

import { createStream } from '../lib/files';
import useWebSocket from './useWebSocket';

interface Progress {
  count: number;
  percent: number;
}

const initialProgress = { count: 0, percent: 0 };

export default (): [(fl: FileList) => void, Progress] => {
  const [{ ws }, connect, disconnect] = useWebSocket('/upload', { lazy: true });
  const [files, setFiles] = useState<FileList>();

  const [progress, setProgress] = useState(initialProgress);
  const resetProgress = useCallback(() => setProgress(initialProgress), []);

  const upload = useCallback(
    (fileList: FileList) => {
      setFiles(fileList);
      connect();
    },
    [connect],
  );

  useEffect(() => {
    // TODO: handle cancellation and socket failure
    // TODO: add delay to wait for socket buffer
    (async () => {
      if (files && files.length && ws) {
        resetProgress();

        const file = files[0];
        ws.send(file.name);

        const stream = createStream(file);
        const reader = stream.getReader();
        let state = await reader.read();
        while (!state.done) {
          const buffer = state.value;

          setProgress(({ count, percent }) => ({
            count: count + 1,
            percent: percent + buffer.byteLength / file.size,
          }));

          ws.send(buffer);
          state = await reader.read(); // eslint-disable-line no-await-in-loop
        }

        disconnect();
      }
    })();
  }, [ws, files, resetProgress, disconnect]);

  return [upload, progress];
};
