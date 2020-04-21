import { concatStreams, createBlobStream } from './streams';

export function createStream(f: File | FileList): ReadableStream<ArrayBuffer> {
  if (f instanceof File) {
    return createBlobStream(f);
  }
  return concatStreams(Array.from(f).map(createBlobStream));
}
