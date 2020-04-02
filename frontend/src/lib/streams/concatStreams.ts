class StreamsSource implements UnderlyingSource {
  private streams: ReadableStream[];
  private index: number;
  private reader?: ReadableStreamReader;

  constructor(streams: ReadableStream[]) {
    this.streams = streams;
    this.index = 0;
    this.nextReader();
  }

  private nextReader(): void {
    /** Type is asserted here because `next` can be `undefined` if `index` is too big, but TypeScript doesn't warn about this. */
    const next = this.streams[this.index] as ReadableStream | undefined;
    this.reader = next && next.getReader();
    this.index += 1;
  }

  public async pull(controller: ReadableStreamDefaultController): Promise<void> {
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

export default function concatStreams(streams: ReadableStream[]): ReadableStream {
  return new ReadableStream(new StreamsSource(streams));
}
