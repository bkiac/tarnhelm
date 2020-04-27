import * as stream from '../../stream';
import { Mode } from './constants';

function createSlicer(
  mode: Mode,
  recordSize: number,
): RequiredBy<Transformer<Uint8Array, Uint8Array>, 'transform'> {
  let chunkSize = mode === Mode.Encrypt ? recordSize - 17 : 21;
  let partialChunk = new Uint8Array(chunkSize);
  let offset = 0;

  function enqueue(
    buffer: Uint8Array,
    controller: TransformStreamDefaultController<Uint8Array>,
  ): void {
    controller.enqueue(buffer);
    if (chunkSize === 21 && mode === Mode.Decrypt) {
      chunkSize = recordSize;
    }
    partialChunk = new Uint8Array(chunkSize);
    offset = 0;
  }

  const transform: TransformStreamDefaultControllerTransformCallback<Uint8Array, Uint8Array> = (
    chunk,
    controller,
  ) => {
    let i = 0;

    if (offset > 0) {
      const len = Math.min(chunk.byteLength, chunkSize - offset);
      partialChunk.set(chunk.slice(0, len), offset);
      offset += len;
      i += len;

      if (offset === chunkSize) {
        enqueue(partialChunk, controller);
      }
    }

    while (i < chunk.byteLength) {
      const remainingBytes = chunk.byteLength - i;
      if (remainingBytes >= chunkSize) {
        const record = chunk.slice(i, i + chunkSize);
        i += chunkSize;
        enqueue(record, controller);
      } else {
        const end = chunk.slice(i, i + remainingBytes);
        i += end.byteLength;
        partialChunk.set(end);
        offset = end.byteLength;
      }
    }
  };

  const flush: TransformStreamDefaultControllerCallback<Uint8Array> = (controller) => {
    if (offset > 0) {
      controller.enqueue(partialChunk.slice(0, offset));
    }
  };

  return { transform, flush };
}

export default function slice(
  input: ReadableStream<Uint8Array>,
  options: { mode: Mode; recordSize: number },
): ReadableStream<Uint8Array> {
  const { mode, recordSize } = options;
  return stream.transform(input, createSlicer(mode, recordSize));
}
