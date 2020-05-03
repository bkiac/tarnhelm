import Redis from 'redis';
import * as util from 'util';
import { isNil } from 'lodash';

import config from '../../config';

type OK = Promise<'OK'>;

const { url: redisUrl } = config.get('redis');
const redis = Redis.createClient({
  url: redisUrl,
  retry_strategy: (options) => {
    if (options.total_retry_time > 10000) {
      const msg = 'Retry time exhausted!';
      redis.emit('error', msg);
      return new Error(msg);
    }
    return 500;
  },
});

function promisifyRedis<C extends (...args: any[]) => Promise<any>>(
  command: (...args: any[]) => any,
): C {
  /* eslint-disable */
  // @ts-ignore
  return util.promisify<any, any, any>(command).bind(redis);
  /* eslint-enable */
}

/* eslint-disable @typescript-eslint/unbound-method */
const setAsync: (key: string, value: string, ...options: string[]) => OK = promisifyRedis(
  redis.set,
);

interface RedisSetOptions {
  EX?: number;
  PX?: number;
  NX?: true;
  XX?: true;
  KEEPTTL?: boolean;
}

/** https://redis.io/commands/set */
export async function set(key: string, value: string, opts?: RedisSetOptions): OK {
  const modifiers: string[] = [];
  if (opts) {
    const { EX, PX, NX, XX, KEEPTTL } = opts;

    if (!isNil(EX)) {
      modifiers.push('EX', EX.toString());
    } else if (!isNil(PX)) {
      modifiers.push('PX', PX.toString());
    }

    if (NX) {
      modifiers.push('NX');
    } else if (XX) {
      modifiers.push('XX');
    }

    if (KEEPTTL) modifiers.push('KEEPTTL');
  }

  return setAsync(key, value, ...modifiers);
}

/** https://redis.io/commands/get */
export const get: (key: string) => Promise<string | undefined> = promisifyRedis(redis.get);

/** https://redis.io/commands/mget */
export const mget: (keys: string[]) => Promise<Array<string | undefined>> = promisifyRedis(
  redis.mget,
);

/** https://redis.io/commands/del */
export const del: (...keys: string[]) => Promise<number> = promisifyRedis(redis.del);

/** https://redis.io/commands/ttl */
export const ttl: (key: string) => Promise<number> = promisifyRedis(redis.ttl);

const existsAsync: (...keys: string[]) => Promise<number[]> = promisifyRedis(redis.exists);

/** https://redis.io/commands/exists */
export async function exists(...keys: string[]): Promise<boolean[]> {
  const result = await existsAsync(...keys);
  return result.map((value) => value === 1);
}
/* eslint-enable */
