import { useEffect, useState } from 'react';

import { createStream } from '../lib/files';
import useSocket from './useSocket';

export default function useUpload(): [(fl: FileList) => void, number] {
  const [socket] = useSocket();
  const [files, setFiles] = useState<FileList>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function upload(s: SocketIOClient.Socket, fl: FileList): Promise<void> {
      // TODO: collect metadata: name, extension etc.
      // TODO: handle cancellation and socket failure
      // TODO: add delay to wait for socket buffer
      const file = fl[0];
      const stream = createStream(file);
      const reader = stream.getReader();
      let state = await reader.read();
      while (!state.done) {
        const buffer = state.value;
        setProgress(
          (prevProgress) => prevProgress + Math.floor((buffer.byteLength / file.size) * 100),
        );
        console.log('Sending chunk');
        // @ts-ignore
        s.binary(true).emit('upload', buffer);
        state = await reader.read(); // eslint-disable-line no-await-in-loop
      }
    }

    if (files && socket) {
      upload(socket, files);
    }
  }, [socket, files]);

  return [(fl) => setFiles(fl), progress];
}
