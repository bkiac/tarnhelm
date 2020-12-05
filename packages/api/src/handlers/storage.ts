import * as crypto from "crypto"
import type express from "express"
import type expressWs from "express-ws"
import Joi from "joi"
import type { SubscribeToInvoiceInvoiceUpdatedEvent } from "ln-service"
import { isNil } from "lodash"
import * as stream from "stream"
import { v4 as uuid } from "uuid"
import * as ws from "ws"
import config from "../config"
import * as lnd from "../lib/lnd"
import * as storage from "../lib/storage/storage"
import * as webSocket from "../lib/web-socket"
import { log } from "../utils"

const storageConfig = config.get("storage")

function eof(): stream.Transform {
	return new stream.Transform({
		transform(chunk: Buffer, encoding, callback) {
			if (chunk.length === 1 && chunk[0] === 0) {
				this.push(null)
			} else {
				this.push(chunk)
			}
			callback()
		},
	})
}

function limiter(limit = storageConfig.fileSize.max): stream.Transform {
	let length = 0
	return new stream.Transform({
		transform(chunk: Buffer, encoding, callback): void {
			length += chunk.length
			this.push(chunk)
			return length > limit ? callback(new Error("limit")) : callback()
		},
	})
}

type UploadParams = {
	metadata: string
	authb64: string
	size: number
	downloadLimit: number
	expiry: number
}

const uploadParamsSchema = Joi.object<UploadParams>({
	metadata: Joi.string().required(),
	authb64: Joi.string().required(),
	size: Joi.number().required().integer().max(storageConfig.fileSize.max),
	downloadLimit: Joi.number()
		.required()
		.integer()
		.min(1)
		.max(storageConfig.downloads.max),
	expiry: Joi.number()
		.required()
		.integer()
		.min(1)
		.max(storageConfig.expiry.max),
})

function validateUploadParams(
	stringifiedParams: string,
): [UploadParams] | [undefined, string[]] {
	let params: unknown
	try {
		params = JSON.parse(stringifiedParams) as unknown
	} catch (err: unknown) {
		return [undefined, [(err as Error).message]]
	}

	const { errors } = uploadParamsSchema.validate(params)
	if (errors) {
		return [undefined, errors.details.map(({ message }) => message)]
	}

	// Assertion is safe after validation
	return [params as UploadParams]
}

export const upload: expressWs.WebsocketRequestHandler = (client) => {
	let fileStream: stream.Duplex | undefined

	client.addEventListener("close", (event) => {
		if (event.code !== 1000 && fileStream) {
			fileStream.destroy()
		}
	})

	client.once("message", (msg: string) => {
		const [params, errors] = validateUploadParams(msg)
		if (!params || errors) {
			webSocket.send(client, { error: 400 })
			client.close()
			return
		}

		const id = uuid()
		lnd
			.createInvoice({
				tokens: 500,
			})
			.then((invoice) => {
				webSocket.send(client, { data: { id, invoice } })

				const { metadata, size, downloadLimit, expiry, authb64 } = params
				const invoiceSubscription = lnd.subscribeToInvoice(invoice)
				invoiceSubscription.on(
					"invoice_updated",
					(invoiceUpdate: SubscribeToInvoiceInvoiceUpdatedEvent) => {
						if (invoiceUpdate.is_confirmed) {
							webSocket.send(client, {
								data: { invoicePaymentConfirmation: invoiceUpdate },
							})

							fileStream = ws
								.createWebSocketStream(client)
								.pipe(eof())
								.pipe(limiter())

							log("Start storage upload", { id })

							storage
								.set(
									{ id, stream: fileStream, metadata, size },
									{ downloadLimit, expiry, authb64 },
									(progress) =>
										webSocket.send(client, { data: progress.loaded }),
								)
								.then((data) => {
									log("Finish storage upload", { data })
								})
								.catch((err: Error) => {
									log("Storage error", { id, error: err })

									webSocket.send(client, {
										error: err.message === "limit" ? 413 : 500,
									})

									fileStream?.destroy()
									storage
										.del(id)
										.then(() => {
											log("Temporary file deleted", { id })
										})
										.catch((err2: Error) => {
											log("Storage error", { id, error: err2 })
										})
								})
								.finally(() => {
									client.close()
								})
						}
					},
				)
			})
			.catch((err3) => {
				log("LND Invoice Error", { id, error: err3 })
			})
	})
}

export const download: express.RequestHandler<{ id: string }> = async (
	req,
	res,
) => {
	try {
		const {
			params: { id },
		} = req

		const {
			authb64,
			nonce,
			downloads,
			downloadLimit,
		} = await storage.getMetadata(id)

		if (downloads >= downloadLimit) {
			res.sendStatus(404)
			return
		}

		const authHeader = req.header("Authorization")?.split(" ")[1]
		if (isNil(authHeader)) {
			res.sendStatus(401)
			return
		}

		const hash = crypto
			.createHmac("sha256", Buffer.from(authb64, "base64"))
			.update(Buffer.from(nonce, "base64"))
			.digest()
		try {
			const authenticated = crypto.timingSafeEqual(
				hash,
				Buffer.from(authHeader, "base64"),
			)
			if (!authenticated) {
				res.sendStatus(401)
				return
			}
		} catch (error: unknown) {
			res.sendStatus(401)
			return
		}

		const newNonce = await storage.setNonce(id)
		res.set("WWW-Authenticate", `tarnhelm ${newNonce}`)

		const fileStream = await storage.get(id)

		let cancelled = false
		let finished = false

		log("Start storage download", { id })
		fileStream
			.pipe(res)
			.on("finish", () => {
				if (!cancelled) {
					finished = true
					storage.bumpDownloads(id).then(
						(newDownloads) => {
							if (newDownloads >= downloadLimit) {
								storage.del(id).then(
									() => {
										log("Finish storage download and delete file", { id })
									},
									() => {},
								)
							} else {
								log("Finish storage download", { id })
							}
						},
						() => {},
					)
				}
			})
			.on("close", () => {
				if (!finished) {
					cancelled = true
					log("Storage download error", { id })
					fileStream.destroy()
				}
			})
	} catch (error: unknown) {
		res.sendStatus(404)
	}
}

export const getMetadata: express.RequestHandler<{ id: string }> = async (
	req,
	res,
) => {
	try {
		const {
			authb64,
			downloads,
			downloadLimit,
			...metadata
		} = await storage.getMetadata(req.params.id)

		if (downloads >= downloadLimit) {
			res.sendStatus(404)
			return
		}

		res.send(metadata)
	} catch (error: unknown) {
		res.sendStatus(404)
	}
}
