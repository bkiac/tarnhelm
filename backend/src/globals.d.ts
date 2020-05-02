declare type Nil = null | undefined;

declare type NonNilPrimitive = string | number | bigint | boolean | symbol;
declare type Primitive = Nil | NonNilPrimitive;

declare type SafeAny = Primitive | object;

namespace NodeJS {
  type SyncListener = (...args: any[]) => void;
  type AsyncListener = (...args: any[]) => Promise<void>;
  type Listener = SyncListener | AsyncListener;

  interface EventEmitter {
    addListener: (event: string | symbol, listener: Listener) => this;
    on: (event: string | symbol, listener: Listener) => this;
    once: (event: string | symbol, listener: Listener) => this;
    removeListener: (event: string | symbol, listener: Listener) => this;
    off: (event: string | symbol, listener: Listener) => this;
  }
}
