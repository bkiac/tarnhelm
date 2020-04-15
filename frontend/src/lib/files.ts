import { concatStreams, createBlobStream } from './streams';

export function createStream(files: FileList): ReadableStream {
  return concatStreams(Array.from(files).map(createBlobStream));
}
