import { useMemo, useEffect, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { differenceInMilliseconds, addMilliseconds } from 'date-fns';

import { createStream } from '../lib/files';
import useWebSocket from './useWebSocket';

interface Progress {
  count: number;
  percent: number;
  estimate: Date | undefined;
}

const initialProgress = { count: 0, percent: 0, estimate: undefined };

export default (): [(fl: FileList) => void, Progress] => {
  const id = useMemo(() => uuid(), []);

  const [{ ws }, connect, disconnect] = useWebSocket('/upload', { lazy: true });

  const [files, setFiles] = useState<FileList>();

  const [progress, setProgress] = useState<Progress>(initialProgress);
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
        const startDate = new Date();

        resetProgress();

        const file = files[0];

        ws.addEventListener('message', (event) => {
          const { data } = event;
          const bufferLength = Number.parseInt(data, 10);
          setProgress((prevProgress) => {
            const { count, percent } = prevProgress;

            const newCount = count + 1;
            const newPercent = percent + bufferLength / file.size;
            const now = new Date();
            const newEstimate = addMilliseconds(
              now,
              differenceInMilliseconds(now, startDate) / newPercent,
            );

            return {
              count: newCount,
              percent: newPercent,
              estimate: newEstimate,
            };
          });
        });

        ws.send(file.name);

        const stream = createStream(file);
        const reader = stream.getReader();
        let state = await reader.read();
        while (!state.done) {
          const buffer = state.value;
          ws.send(buffer);
          state = await reader.read(); // eslint-disable-line no-await-in-loop
        }

        disconnect();
      }
    })();
  }, [ws, files, resetProgress, disconnect, id]);

  return [upload, progress];
};
