/**
 * Based on https://github.com/mozilla/send/blob/master/app/streams.js
 */
/* eslint-disable no-await-in-loop */
import BlobSource from './BlobSource';
import StreamsSource from './StreamsSource';

export function concat<T>(streams: ReadableStream<T>[]): ReadableStream<T> {
  return new ReadableStream<T>(new StreamsSource(streams));
}

export function createBlobStream(blob: Blob, chunkSize?: number): ReadableStream<ArrayBuffer> {
  return new ReadableStream(new BlobSource(blob, chunkSize));
}

/**
 * Convert a plain stream (stream containing `Uint8Array` parts) to an `ArrayBuffer`.
 */
export async function toArrayBuffer<T extends Uint8Array>(
  plainStream: ReadableStream<T>,
  size?: number,
): Promise<ArrayBuffer> {
  const reader = plainStream.getReader();
  let state = await reader.read();

  if (size) {
    const result = new Uint8Array(size);
    let offset = 0;
    while (!state.done) {
      result.set(state.value, offset);
      offset += state.value.length;
      state = await reader.read();
    }
    return result.buffer;
  }

  const parts: T[] = [];
  let len = 0;
  while (!state.done) {
    parts.push(state.value);
    len += state.value.length;
    state = await reader.read();
  }
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
 * to implement a manual `pipeThrough`.
 * See: https://caniuse.com/#search=pipethrough
 */
export function transform<I, O = I>(
  stream: ReadableStream<I>,
  transformer: RequiredBy<Transformer<I, O>, 'transform'>,
  oncancel: ReadableStreamErrorCallback,
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
        if (oncancel) {
          oncancel(reason);
        }
      },
    });
    /* eslint-enable */
  }
}
