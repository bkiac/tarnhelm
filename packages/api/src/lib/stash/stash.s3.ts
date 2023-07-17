import AWS from "aws-sdk"
import type * as stream from "stream"
import crypto from "crypto"
import {r} from "../result"
import type {Stash} from "./stash.port"

type AccessKey = {
	id: string
	secret: string
}

type CreateS3ClientOptions = {
	bucket: string
	accessKey: AccessKey
}

const generateNonce = (): string => crypto.randomBytes(16).toString("base64")

export const createClient = (options: CreateS3ClientOptions): Stash.Client => {
	const s3 = new AWS.S3({
		accessKeyId: options.accessKey.id,
		secretAccessKey: options.accessKey.secret,
		s3ForcePathStyle: true,
		signatureVersion: "v4",
	})

	const params = (key: string) => ({Bucket: options.bucket, Key: key} as const)

	const simpleUpload = async (
		input: Stash.BlobUploadInput,
		listener?: Stash.Listener,
	): Promise<Stash.Entity> => {
		const {key, body, length, expiry, ...metadata} = input
		const u = s3.upload({
			Bucket: options.bucket,
			Key: key,
			Body: body,
			ContentLength: length,
			Metadata: {
				...metadata,
				downloads: "0",
				limit: metadata.limit.toString(),
			},
		})
		if (listener) {
			u.on("httpUploadProgress", listener)
		}
		await u.promise()
		return {
			key,
			auth: metadata.auth,
			downloads: {
				current: 0,
				limit: metadata.limit,
			},
			length,
			nonce: generateNonce(),
			properties: metadata.properties,
		}
	}
	const upload = r.wtca(simpleUpload)

	// TODO: bump downloads if stream end
	const simpleDownload = (key: string): stream.Readable =>
		s3.getObject(params(key)).createReadStream()
	const download = r.wtc(simpleDownload)

	const simpleGet = async (key: string): Promise<Stash.Entity> => {
		const head = await s3.headObject(params(key)).promise()
		return {
			auth: head.Metadata.auth,
			key,
			downloads: {
				current: head.Metadata.current,
				limit: head.Metadata.limit,
			},
			length: head.ContentLength,
			nonce: head.Metadata.nonce,
			properties: head.Metadata.properties,
		}
	}
	const get = r.wtca(simpleGet)

	const simpleUpdate = async (
		input: Stash.BlobUpdateInput,
	): Promise<Stash.Entity> => {
		const blob = await simpleGet(input.key)
		await s3
			.putObject({
				...params(input.key),
				Metadata: {}, // TODO
			})
			.promise()
		return blob
	}
	const update = r.wtca(simpleUpdate)

	const simpleDelete = async (key: Stash.Key): Promise<Stash.Key> => {
		await s3.deleteObject(params(key)).promise()
		return key
	}
	const del = r.wtca(simpleDelete)

	const simpleBumpDownloads = async (key: Stash.Key): Promise<Stash.Entity> => {
		const blob = await simpleGet(key)
		const nextCurrent = blob.downloads.current + 1
		if (nextCurrent > blob.downloads.limit) {
			throw new Error("download limit exceeded")
		}
		return simpleUpdate({key, numOfDownloads: blob.downloads.current + 1})
	}
	const bumpDownloads = r.wtca(simpleBumpDownloads)

	const simpleUpdateNonce = async (
		key: Stash.Key,
		nonce = generateNonce(),
	) => {}

	return {
		upload,
		download,

		get,

		update,

		delete: del,

		bumpDownloads,

		updateNonce,
	}
}
