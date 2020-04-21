import { useMemo, useEffect, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { differenceInMilliseconds, addMilliseconds } from 'date-fns';

import { createStream } from '../lib/files';
import useWebSocket from './useWebSocket';

interface Progress {
  loading: boolean;
  count: number;
  uploaded: number;
  percent: number;
  estimate: Date | undefined;
}

const initialProgress = { loading: false, count: 0, uploaded: 0, percent: 0, estimate: undefined };

export default (): [(fl: FileList) => void, Progress] => {
  const id = useMemo(() => uuid(), []);

  const [{ ws }, connect, disconnect] = useWebSocket('/upload', { lazy: true });

  // const [files, setFiles] = useState<FileList>();
  const [file, setFile] = useState<File>();

  const [progress, setProgress] = useState<Progress>(initialProgress);
  const start = useCallback(() => setProgress({ ...initialProgress, loading: true }), []);
  const finish = useCallback(
    () => setProgress((prevProgress) => ({ ...prevProgress, loading: false })),
    [],
  );

  /** Handle start */
  const upload = useCallback(
    (fileList: FileList) => {
      setFile(fileList[0]);
      start();
      connect();
    },
    [start, connect],
  );

  /** Handle finish */
  useEffect(() => {
    if (file && progress.uploaded >= file.size) {
      finish();
      disconnect();
    }
  }, [file, progress.uploaded, disconnect, finish]);

  /** Handle upload */
  useEffect(() => {
    // TODO: handle cancellation and socket failure
    // TODO: add delay to wait for socket buffer
    (async () => {
      if (file && ws) {
        const startDate = new Date();

        ws.addEventListener('message', (event) => {
          const { uploaded } = JSON.parse(event.data);
          setProgress((prevProgress) => {
            const { count: prevCount } = prevProgress;

            const count = prevCount + 1;
            const percent = uploaded / file.size;
            const now = new Date();
            const estimate = addMilliseconds(
              now,
              differenceInMilliseconds(now, startDate) / percent,
            );

            return {
              loading: true,
              count,
              uploaded,
              percent,
              estimate,
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
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(new Uint8Array([0])); // EOF signal
        }
      }
    })();
  }, [ws, file, id]);

  return [upload, progress];
};
