import * as crypto from "crypto"
import { isNil } from "lodash"
import type * as stream from "stream"
import config from "../../config"
import { log } from "../../utils"
import { redis } from "./redis"
import * as s3 from "./s3"

const storageConfig = config.get("storage")

function generateNonce(): string {
	return crypto.randomBytes(16).toString("base64")
}

type StorageMetadata = {
	downloadLimit: number
	downloads: number
	authb64: string
	nonce: string
	encryptedContentMetadata: string
}

function marshalStorageMetadata(
	metadata: Partial<Record<string, string>>,
): StorageMetadata | undefined {
	const {
		downloadLimit,
		downloads,
		authb64,
		nonce,
		encryptedContentMetadata,
	} = metadata
	if (
		downloadLimit == null ||
		downloads == null ||
		authb64 == null ||
		nonce == null ||
		encryptedContentMetadata == null
	) {
		return undefined
	}
	return {
		downloadLimit: Number.parseInt(downloadLimit, 10),
		downloads: Number.parseInt(downloads, 10),
		authb64,
		nonce,
		encryptedContentMetadata,
	}
}

export async function getMetadata(id: string): Promise<StorageMetadata> {
	const res = marshalStorageMetadata(await redis.hgetall(id))
	if (isNil(res)) {
		throw new Error(`Metadata with ID "${id}" is malformed.`)
	}
	return res
}

export type StorageUploadArgs = {
	id: string
	stream: stream.Readable
	metadata: string
	size?: number
}

export type StorageUploadOptions = {
	authb64: string
	downloadLimit?: number
	expiry?: number // in seconds
}

export async function set(
	file: StorageUploadArgs,
	options: StorageUploadOptions,
	listener?: s3.S3UploadListener,
): ReturnType<typeof s3.set> {
	const { id, metadata, size } = file
	const {
		expiry = storageConfig.expiry.def,
		downloadLimit = storageConfig.downloads.def,
		authb64,
	} = options

	await redis
		.multi()
		.hmset(id, {
			downloadLimit,
			downloads: 0,
			authb64,
			nonce: generateNonce(),
			encryptedContentMetadata: metadata,
		})
		.expire(id, expiry)
		.exec()

	return s3.set({ key: id, body: file.stream, length: size }, listener)
}

export async function isAvailable(id: string): Promise<boolean> {
	try {
		const { downloads, downloadLimit } = await getMetadata(id)
		return downloads < downloadLimit
	} catch (error: unknown) {
		return false
	}
}

export async function get(id: string): Promise<ReturnType<typeof s3.get>> {
	const available = await isAvailable(id)
	if (!available) {
		throw new Error(`File with id "${id}" is not available.`)
	}
	return s3.get(id)
}

export async function del(id: string): ReturnType<typeof s3.del> {
	await redis.del(id)
	return s3.del(id)
}

export async function bumpDownloads(id: string): Promise<number> {
	return redis.hincrby(id, "downloads", 1)
}

export async function setNonce(
	id: string,
	nonce = generateNonce(),
): Promise<string> {
	await redis.hset(id, "nonce", nonce)
	return nonce
}

export async function clean(): Promise<void> {
	// TODO: handle more than 1000 files
	const files = await s3.list()
	const keys = files.Contents?.map((fileObject) => fileObject.Key).filter<
		string
	>((key): key is string => !isNil(key))
	if (keys) {
		log(`There are ${keys.length} files in S3.`)
		const ttls = await Promise.all(keys.map(async (key) => redis.ttl(key)))
		const keysToDelete = ttls.reduce<string[]>((acc, ttl, i) => {
			if (ttl <= 0) {
				acc.push(keys[i])
			}
			return acc
		}, [])
		if (keysToDelete.length > 0) {
			log(`Deleting ${keysToDelete.length} unavailable files.`)
			await s3.delMany(keysToDelete)
		} else {
			log("There are no unavailable files.")
		}
	} else {
		log("There are no unavailable files.")
	}
}
