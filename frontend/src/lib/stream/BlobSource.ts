export default class BlobSource implements UnderlyingSource<ArrayBuffer> {
  private blob: Blob;
  private index: number;
  private chunkSize: number;

  constructor(blob: Blob, chunkSize?: number) {
    this.blob = blob;
    this.chunkSize = chunkSize || 1024 * 64;
    this.index = 0;
  }

  public pull(controller: ReadableStreamDefaultController<ArrayBuffer>): Promise<void> {
    return new Promise((resolve, reject) => {
      const bytesLeft = this.blob.size - this.index;

      if (bytesLeft > 0) {
        const chunkSize = Math.min(this.chunkSize, bytesLeft);
        const slice = this.blob.slice(this.index, this.index + chunkSize);

        const reader = new FileReader();
        reader.onload = () => {
          // https://github.com/microsoft/TypeScript/issues/4163#issuecomment-331678032
          controller.enqueue(new Uint8Array(reader.result as ArrayBuffer));
          resolve();
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(slice);

        this.index += chunkSize;
      } else {
        controller.close();
        resolve();
      }
    });
  }
}
