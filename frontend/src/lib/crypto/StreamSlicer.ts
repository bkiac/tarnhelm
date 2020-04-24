import { Mode } from './constants';

type Controller = TransformStreamDefaultController<Uint8Array>;

/**
 * Re-slice stream into record sized chunks
 */
export default class StreamSlicer implements Transformer<Uint8Array, Uint8Array> {
  private mode: Mode;

  private recordSize: number;
  private chunkSize: number;
  private partialChunk: Uint8Array;
  private offset: number;

  constructor(mode: Mode, recordSize: number) {
    this.mode = mode;
    this.recordSize = recordSize;
    this.chunkSize = mode === Mode.Encrypt ? recordSize - 17 : 21;
    this.partialChunk = new Uint8Array(this.chunkSize);
    this.offset = 0;
  }

  private send(buffer: Uint8Array, controller: Controller): void {
    controller.enqueue(buffer);
    if (this.chunkSize === 21 && this.mode === Mode.Decrypt) {
      this.chunkSize = this.recordSize;
    }
    this.partialChunk = new Uint8Array(this.chunkSize);
    this.offset = 0;
  }

  public transform(chunk: Uint8Array, controller: Controller): void {
    let i = 0;

    if (this.offset > 0) {
      const len = Math.min(chunk.byteLength, this.chunkSize - this.offset);
      this.partialChunk.set(chunk.slice(0, len), this.offset);
      this.offset += len;
      i += len;

      if (this.offset === this.chunkSize) {
        this.send(this.partialChunk, controller);
      }
    }

    while (i < chunk.byteLength) {
      const remainingBytes = chunk.byteLength - i;
      if (remainingBytes >= this.chunkSize) {
        const record = chunk.slice(i, i + this.chunkSize);
        i += this.chunkSize;
        this.send(record, controller);
      } else {
        const end = chunk.slice(i, i + remainingBytes);
        i += end.byteLength;
        this.partialChunk.set(end);
        this.offset = end.byteLength;
      }
    }
  }

  public flush(controller: Controller): void {
    if (this.offset > 0) {
      controller.enqueue(this.partialChunk.slice(0, this.offset));
    }
  }
}
