import { concatStreams, createBlobStream } from './streams';

export function createStream(files: FileList): ReadableStream<ArrayBuffer> {
  return concatStreams(Array.from(files).map(createBlobStream));
}
