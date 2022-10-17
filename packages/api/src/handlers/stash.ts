import * as crypto from "crypto"
import Joi from "joi"
import {isNil} from "lodash"
import * as stream from "stream"
import {v4 as uuid} from "uuid"
import * as ws from "ws"
import type {SubscribeToInvoiceInvoiceUpdatedEvent} from "lightning"
import type expressWs from "express-ws"
import type express from "express"
import {config} from "../config"
import * as lnd from "../lib/lnd"
import {getPriceQuote} from "../lib/price"
import * as stash from "../lib/stash"
import * as webSocket from "../lib/webSocket"
import {asAsyncListener, log} from "../utils"

const stashConfig = config.get("stash")

function eof(): stream.Transform {
	return new stream.Transform({
		transform(chunk: Buffer, _, callback) {
			if (chunk.length === 1 && chunk[0] === 0) {
				this.push(null)
			} else {
				this.push(chunk)
			}
			callback()
		},
	})
}

function limiter(limit = stashConfig.fileSize.max): stream.Transform {
	let length = 0
	return new stream.Transform({
		transform(chunk: Buffer, _, callback): void {
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
	size: Joi.number().required().integer().max(stashConfig.fileSize.max),
	downloadLimit: Joi.number()
		.required()
		.integer()
		.min(1)
		.max(stashConfig.downloads.max),
	expiry: Joi.number().required().integer().min(1).max(stashConfig.expiry.max),
})

function validateUploadParams(
	stringifiedParams: string,
): [UploadParams, undefined] | [undefined, string[]] {
	let params: unknown
	try {
		params = JSON.parse(stringifiedParams) as unknown
	} catch (err: unknown) {
		return [undefined, [(err as Error).message]]
	}

	// Care: `errors` is always `undefined`, use `error`
	// See: https://github.com/sideway/joi/issues/2523
	const {error} = uploadParamsSchema.validate(params)
	if (error) {
		return [undefined, error.details.map(({message}) => message)]
	}

	// Assertion is safe after validation
	return [params as UploadParams, undefined]
}

export const upload: expressWs.WebsocketRequestHandler = (client) => {
	let fileStream: stream.Duplex | undefined

	client.addEventListener("close", (event) => {
		if (event.code !== 1000 && fileStream) {
			fileStream.destroy()
		}
	})

	client.once(
		"message",
		asAsyncListener(async (msg: string) => {
			const [params, errors] = validateUploadParams(msg)
			if (!params || errors) {
				webSocket.send(client, {error: 400})
				client.close()
				return
			}

			const id = uuid()
			const sats = await getPriceQuote(params)
			const {metadata, size, downloadLimit, expiry, authb64} = params
			const invoice = await lnd.createInvoice({
				tokens: sats,
				description: `Size: ${size}B, Download Limit: ${downloadLimit}, Expiry: ${expiry}s`,
			})
			webSocket.send(client, {
				data: {
					id,
					invoice: {
						createdAt: invoice.created_at,
						request: invoice.request,
						tokens: invoice.tokens,
						description: invoice.description,
					},
				},
			})

			const invoiceSubscription = lnd.subscribeToInvoice(invoice)
			invoiceSubscription.on(
				"invoice_updated",
				asAsyncListener(
					async (invoiceUpdate: SubscribeToInvoiceInvoiceUpdatedEvent) => {
						if (invoiceUpdate.is_confirmed) {
							webSocket.send(client, {
								data: {
									invoicePaymentConfirmation: {
										createdAt: invoiceUpdate.created_at,
										description: invoiceUpdate.description,
										expiresAt: invoiceUpdate.expires_at,
										received: invoiceUpdate.received,
										request: invoiceUpdate.request,
										tokens: invoiceUpdate.tokens,
									},
								},
							})

							fileStream = ws
								.createWebSocketStream(client)
								.pipe(eof())
								.pipe(limiter(size))

							log("Start upload", {id})

							try {
								const data = await stash.set(
									{id, stream: fileStream, metadata, size},
									{downloadLimit, expiry, authb64},
									(progress) => webSocket.send(client, {data: progress.loaded}),
								)
								log("Finish upload", {data})
							} catch (e: unknown) {
								const err = e as Error
								log("stash error", {id, error: err})

								fileStream.destroy()

								webSocket.send(client, {
									error: err.message === "limit" ? 413 : 500,
								})

								await stash.del(id)
								log("Temporary file deleted", {id})
							}
						}
					},
				),
			)
		}),
	)
}

export const download: express.RequestHandler<{id: string}> = async (
	req,
	res,
) => {
	try {
		const {
			params: {id},
		} = req

		const {authb64, nonce, downloads, downloadLimit} = await stash.getMetadata(
			id,
		)

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

		const newNonce = await stash.setNonce(id)
		res.set("WWW-Authenticate", `tarnhelm ${newNonce}`)

		const fileStream = await stash.get(id)

		let cancelled = false
		let finished = false

		log("Start download", {id})
		fileStream
			.pipe(res)
			.on(
				"finish",
				asAsyncListener(async () => {
					if (!cancelled) {
						finished = true
						const newDownloads = await stash.bumpDownloads(id)
						if (newDownloads >= downloadLimit) {
							await stash.del(id)
							log("Finish stash download and delete file", {id})
						} else {
							log("Finish stash download", {id})
						}
					}
				}),
			)
			.on("close", () => {
				if (!finished) {
					cancelled = true
					log("stash download error", {id})
					fileStream.destroy()
				}
			})
	} catch (error: unknown) {
		res.sendStatus(404)
	}
}

export const getMetadata: express.RequestHandler<{id: string}> = async (
	req,
	res,
) => {
	try {
		const {authb64, downloads, downloadLimit, ...metadata} =
			await stash.getMetadata(req.params.id)

		if (downloads >= downloadLimit) {
			res.sendStatus(404)
			return
		}

		res.send(metadata)
	} catch (error: unknown) {
		res.sendStatus(404)
	}
}
