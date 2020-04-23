/** iOS and IO not supported yet. */

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

export function save(data: Blob | ArrayBuffer, options: Options): void {
  if (data instanceof Blob) {
    return saveBlob(data, options);
  }
  return saveArrayBuffer(data, options);
}
