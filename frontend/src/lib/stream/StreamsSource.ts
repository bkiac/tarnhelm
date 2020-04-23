export default class StreamsSource<T> implements UnderlyingSource<T> {
  private streams: ReadableStream<T>[];
  private index: number;
  private reader?: ReadableStreamReader<T>;

  constructor(streams: ReadableStream[]) {
    this.streams = streams;
    this.index = 0;
    this.nextReader();
  }

  private nextReader(): void {
    // Type is asserted here because `next` can be `undefined` if `index` is too big, but TypeScript doesn't warn about this.
    const next = this.streams[this.index] as ReadableStream<T> | undefined;
    this.reader = next && next.getReader();
    this.index += 1;
  }

  public async pull(controller: ReadableStreamDefaultController<T>): Promise<void> {
    if (this.reader) {
      const data = await this.reader.read();
      if (data.done) {
        this.nextReader();
        return this.pull(controller);
      }
      controller.enqueue(data.value);
    }
    return controller.close();
  }
}
