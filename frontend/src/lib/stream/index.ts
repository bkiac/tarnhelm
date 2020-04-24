/**
 * Based on https://github.com/mozilla/send/blob/master/app/streams.js
 */
/* eslint-disable no-await-in-loop */
import BlobSource from './BlobSource';
import StreamsSource from './StreamsSource';

export async function read<T>(
  stream: ReadableStream<T>,
  callback: (chunk: T) => void,
): Promise<void> {
  const reader = stream.getReader();
  let state = await reader.read();
  while (!state.done) {
    callback(state.value);
    state = await reader.read(); // eslint-disable-line no-await-in-loop
  }
}

export function concat<T>(streams: ReadableStream<T>[]): ReadableStream<T> {
  return new ReadableStream<T>(new StreamsSource(streams));
}

export function createBlobStream(blob: Blob, chunkSize?: number): ReadableStream<ArrayBuffer> {
  return new ReadableStream(new BlobSource(blob, chunkSize));
}

export function createFileStream(f: File | FileList): ReadableStream<ArrayBuffer> {
  if (f instanceof File) {
    return createBlobStream(f);
  }
  return concat(Array.from(f).map(createBlobStream));
}

/**
 * Convert a `Uint8Array` stream to an `ArrayBuffer`.
 */
export async function toArrayBuffer(
  stream: ReadableStream<Uint8Array>,
  size?: number,
): Promise<ArrayBuffer> {
  if (size) {
    const result = new Uint8Array(size);
    let offset = 0;
    await read(stream, (chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });
    return result.buffer;
  }

  const parts: Uint8Array[] = [];
  let len = 0;
  await read(stream, (chunk) => {
    parts.push(chunk);
    len += chunk.length;
  });
  let offset = 0;
  const result = new Uint8Array(len);
  parts.forEach((part) => {
    result.set(part, offset);
    offset += part.length;
  });
  return result.buffer;
}

/**
 * Transform a `ReadableStream`.
 * As `ReadableStream.pipeThrough` is not generally supported,
 * compiler error suppression is allowed
 * so `ReadableStream` controller (`ReadableStreamDefaultController`) can be used
 * as a `TransformStream` controller (`TransformStreamDefaultController`)
 * to implement a manual pipe.
 * See: https://caniuse.com/#search=pipethrough
 */
export function transform<I, O = I>(
  stream: ReadableStream<I>,
  transformer: RequiredBy<Transformer<I, O>, 'transform'>,
  onCancel?: ReadableStreamErrorCallback,
): ReadableStream<O> {
  try {
    return stream.pipeThrough(new TransformStream(transformer));
  } catch (e) {
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    const reader = stream.getReader();
    return new ReadableStream({
      start(controller) {
        if (!transformer.start) return undefined;
        // @ts-ignore
        return transformer.start(controller);
      },

      async pull(controller) {
        let enqueued = false;

        const wrappedController = {
          enqueue(chunk: O) {
            enqueued = true;
            controller.enqueue(chunk);
          },
        };

        while (!enqueued) {
          const data = await reader.read();
          if (data.done) {
            // @ts-ignore
            if (transformer.flush) await transformer.flush(controller);
            return controller.close();
          }
          // @ts-ignore
          await transformer.transform(data.value, wrappedController);
        }

        return undefined;
      },

      cancel(reason) {
        stream.cancel(reason);
        if (onCancel) {
          onCancel(reason);
        }
      },
    });
    /* eslint-enable */
  }
}
