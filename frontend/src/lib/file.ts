/** iOS and IO not supported yet. */
import * as streamUtil from './stream';

interface Options {
  name: string;
  type: string;
}

function saveBlob(blob: Blob, name: string): void {
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = href;
  a.setAttribute('download', name);
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}

function saveArrayBuffer(buffer: ArrayBuffer, options: Options): void {
  const { name, type } = options;
  const view = new DataView(buffer);
  const blob = new Blob([view], { type });
  saveBlob(blob, name);
}

async function saveStream(stream: ReadableStream<Uint8Array>, options: Options): Promise<void> {
  const ab = await streamUtil.toArrayBuffer(stream);
  return saveArrayBuffer(ab, options);
}

export async function save(
  data: Blob | ArrayBuffer | ReadableStream<Uint8Array>,
  options: Options,
): Promise<void> {
  if (data instanceof Blob) return saveBlob(data, options.name);
  if (data instanceof ReadableStream) return saveStream(data, options);
  return saveArrayBuffer(data, options);
}
