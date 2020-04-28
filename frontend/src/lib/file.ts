/** iOS and IO not supported yet. */
import * as stream from './stream';

interface Options {
  name: string;
  type?: string;
}

function saveBlob(blob: Blob, options: Options): void {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = href;
  a.setAttribute('download', options.name);
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}

function saveArrayBuffer(buffer: ArrayBuffer, options: Options): void {
  const view = new DataView(buffer);
  const blob = new Blob([view], { type: options.type });
  saveBlob(blob, options);
}

async function saveStream(_stream: ReadableStream<Uint8Array>, options: Options): Promise<void> {
  const ab = await stream.toArrayBuffer(_stream);
  return saveArrayBuffer(ab, options);
}

export async function save(
  data: Blob | ArrayBuffer | ReadableStream<Uint8Array>,
  options: Options,
): Promise<void> {
  if (data instanceof Blob) return saveBlob(data, options);
  if (data instanceof ReadableStream) return saveStream(data, options);
  return saveArrayBuffer(data, options);
}
