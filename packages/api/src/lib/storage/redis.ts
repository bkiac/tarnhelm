import type { Dictionary } from "lodash"
import { flatten, isNil } from "lodash"
import Redis from "redis"
import * as util from "util"
import config from "../../config"

type OK = "OK"
type Value = string | number

const { url: redisUrl } = config.get("redis")
const redis = Redis.createClient({
	url: redisUrl,
	retry_strategy: (options) => {
		if (options.total_retry_time > 10000) {
			const msg = "Retry time exhausted!"
			redis.emit("error", msg)
			return new Error(msg)
		}
		return 500
	},
})

function promisifyRedis<C extends (...args: any[]) => Promise<any>>(
	command: (...args: any[]) => any,
): C {
	// @ts-expect-error:
	return util.promisify<any, any, any>(command).bind(redis)
}

/* eslint-disable @typescript-eslint/unbound-method */
const setAsync: (
	key: string,
	value: Value,
	...options: string[]
) => Promise<OK> = promisifyRedis(redis.set)

type RedisSetOptions = {
	EX?: number
	PX?: number
	NX?: true
	XX?: true
	KEEPTTL?: boolean
}

/** https://redis.io/commands/set */
export async function set(
	key: string,
	value: Value,
	opts?: RedisSetOptions,
): Promise<OK> {
	const modifiers: string[] = []
	if (opts) {
		const { EX, PX, NX, XX, KEEPTTL } = opts

		if (!isNil(EX)) {
			modifiers.push("EX", EX.toString())
		} else if (!isNil(PX)) {
			modifiers.push("PX", PX.toString())
		}

		if (NX != null) {
			modifiers.push("NX")
		} else if (XX != null) {
			modifiers.push("XX")
		}

		if (KEEPTTL != null && KEEPTTL) {
			modifiers.push("KEEPTTL")
		}
	}

	return setAsync(key, value, ...modifiers)
}

/** https://redis.io/commands/get */
export const get: (key: string) => Promise<Value> = promisifyRedis(redis.get)

/** https://redis.io/commands/mget */
export const mget: (keys: string[]) => Promise<Value[]> = promisifyRedis(
	redis.mget,
)

const hsetAsync: (
	key: string,
	...fieldValuePairs: any[]
) => Promise<number> = promisifyRedis(redis.hset)

/** https://redis.io/commands/hset */
export async function hset(
	key: string,
	fieldValueObject: Dictionary<Value>,
): Promise<number> {
	const fieldValuePairs = flatten(Object.entries(fieldValueObject))
	return hsetAsync(key, ...fieldValuePairs)
}

const hmsetAsync: (
	key: string,
	...fieldValuePairs: any[]
) => Promise<OK> = promisifyRedis(redis.hmset)

/** https://redis.io/commands/hmset */
export async function hmset(
	key: string,
	fieldValueObject: Dictionary<Value>,
): Promise<OK> {
	const fieldValuePairs = flatten(Object.entries(fieldValueObject))
	return hmsetAsync(key, ...fieldValuePairs)
}

/** https://redis.io/commands/hget */
export const hget: (
	key: string,
	field: string,
) => Promise<Value | undefined> = promisifyRedis(redis.hget)

/** https://redis.io/commands/hgetall */
export const hgetall: (
	key: string,
) => Promise<Dictionary<Value | undefined>> = promisifyRedis(redis.hgetall)

/** https://redis.io/commands/del */
export const del: (...keys: string[]) => Promise<OK> = promisifyRedis(redis.del)

const expireAsync: (
	key: string,
	seconds: number,
) => Promise<number> = promisifyRedis(redis.expire)

/** https://redis.io/commands/expire */
export async function expire(key: string, seconds: number): Promise<boolean> {
	const success = await expireAsync(key, seconds)
	return success === 1
}

/** https://redis.io/commands/ttl */
export const ttl: (key: string) => Promise<number> = promisifyRedis(redis.ttl)

/** https://redis.io/commands/hincrby */
export const hincrby: (
	key: string,
	field: string,
	increment: number,
) => Promise<number> = promisifyRedis(redis.hincrby)
/* eslint-enable */
