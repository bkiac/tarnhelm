import { useEffect, useState, useCallback } from 'react';
import { differenceInMilliseconds, addMilliseconds } from 'date-fns';

import * as webSocket from '../lib/web-socket';
import * as stream from '../lib/stream';
import * as crypto from '../lib/crypto';
import useWebSocket from './useWebSocket';

import ikm from '../ikm';
console.log(ikm);

interface Progress {
  loading: boolean;
  count: number;
  uploaded: number;
  percent: number;
  estimate: Date | undefined;
}

interface State {
  id?: string;
  loading: boolean;
  progress: Progress;
}

const initialProgress = { loading: false, count: 0, uploaded: 0, percent: 0, estimate: undefined };

export default (): [State, (fl: FileList) => void] => {
  const [{ ws }, connect, disconnect] = useWebSocket('/upload', { lazy: true });

  // const [files, setFiles] = useState<FileList>();
  const [file, setFile] = useState<File>();

  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [id, setId] = useState<string>();
  const start = useCallback(() => setProgress({ ...initialProgress, loading: true }), []);
  const finish = useCallback(
    () => setProgress((prevProgress) => ({ ...prevProgress, loading: false })),
    [],
  );

  /** Handle start */
  const upload = useCallback(
    (fileList: FileList) => {
      setFile(fileList[0]);
      setId(undefined);
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
        ws.send(file.name);
        const data = await webSocket.listen<{ id: string }>(ws);
        setId(data.id);

        const startDate = new Date();
        webSocket.addMessageListener<{ uploaded: number }>(ws, ({ uploaded }) => {
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

        const fileStream = stream.createFileStream(file);
        const cipherstream = await crypto.encryptStream(fileStream, {
          ikm,
        });
        await stream.read(cipherstream, (chunk) => {
          ws.send(chunk);
        });
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(new Uint8Array([0])); // EOF signal
        }
      }
    })();
  }, [ws, file]);

  return [{ id, progress, loading: progress.loading }, upload];
};
