import { useEffect, useState, useCallback } from 'react';
import { differenceInMilliseconds, addMilliseconds } from 'date-fns';

import * as webSocket from '../lib/web-socket';
import * as stream from '../lib/stream';
import useWebSocket from './useWebSocket';

type FileStream = ReadableStream<ArrayBuffer>;

interface FileUpload {
  stream: FileStream;
  metadata: {
    name: string;
    size: number;
    type: string;
  };
}

interface Progress {
  loading: boolean;
  count: number;
  uploaded: number;
  percent: number;
  estimate: Date | undefined;
}

export interface State {
  id?: string;
  loading: boolean;
  progress: Progress;
}

const initialProgress = { loading: false, count: 0, uploaded: 0, percent: 0, estimate: undefined };

export default (file?: FileUpload): State => {
  const [{ ws }, connect, disconnect] = useWebSocket('/upload', { lazy: true });

  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [id, setId] = useState<string>();

  const start = useCallback(() => {
    setId(undefined);
    setProgress({ ...initialProgress, loading: true });
    connect();
  }, [connect]);
  const finish = useCallback(() => {
    disconnect();
    setProgress((prevProgress) => ({ ...prevProgress, loading: false }));
  }, [disconnect]);

  // Handle start
  useEffect(() => {
    if (file) start();
  }, [file, start]);

  // Handle finish
  useEffect(() => {
    if (file && progress.uploaded >= file.metadata.size) {
      finish();
      disconnect();
    }
  }, [file, progress.uploaded, disconnect, finish]);

  // Handle upload
  useEffect(() => {
    // TODO: handle cancellation and socket failure
    // TODO: add delay to wait for socket buffer
    (async () => {
      if (file && ws) {
        const { stream: fileStream, metadata } = file;

        ws.send(JSON.stringify(metadata));
        const data = await webSocket.listen<{ id: string }>(ws);
        setId(data.id);

        const startDate = new Date();
        webSocket.addMessageListener<{ uploaded: number }>(ws, ({ uploaded }) => {
          setProgress((prevProgress) => {
            const { count: prevCount } = prevProgress;

            const count = prevCount + 1;
            const percent = uploaded / metadata.size;
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

        await stream.read(fileStream, (chunk) => {
          ws.send(chunk);
        });

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(new Uint8Array([0])); // EOF signal
        }
      }
    })();
  }, [ws, file, finish]);

  return { id, progress, loading: progress.loading };
};
