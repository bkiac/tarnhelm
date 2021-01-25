import { useEffect, useState } from "react"
import * as base64 from "../lib/base64"
import type { Crypto } from "../lib/crypto"
import { useCrypto } from "./useCrypto"

type Sign = (nonceb64: string) => Promise<string>
type EncryptMetadata<M> = (metadata: M) => Promise<string>
type DecryptMetadata<M> = (metadatab64: string) => Promise<M>
type EncryptStream = (
	stream: ReadableStream<Uint8Array>,
) => Promise<ReadableStream<Buffer>>
type DecryptStream = (
	stream: ReadableStream<Uint8Array>,
) => ReadableStream<Buffer>

export type Keyring<M> = {
	secretb64: string
	authb64: string
	sign: Sign
	encryptMetadata: EncryptMetadata<M>
	decryptMetadata: DecryptMetadata<M>
	encryptStream: EncryptStream
	decryptStream: DecryptStream
	calculateEncryptedSize: Crypto["ece"]["calculateEncryptedSize"]
}

export function useKeyring<M>(secretb64?: string): Keyring<M> | undefined {
	const crypto = useCrypto()

	const [keyring, setKeyring] = useState<Keyring<M> | undefined>()
	useEffect(() => {
		if (crypto) {
			const secret =
				secretb64 == null ? crypto.ece.generateIkm() : base64.toArray(secretb64)

			const createKeyring = async (): Promise<void> => {
				const authKey = await crypto.ece.generateAuthenticationKey(
					new Uint8Array(),
					secret,
				)
				const authb64 = base64.fromArray(await crypto.ece.exportKey(authKey))

				const metadataKey = await crypto.ece.generateMetadataEncryptionKey(
					new Uint8Array(),
					secret,
				)

				const sign: Sign = async (nonceb64) => {
					const signature = await crypto.ece.sign(
						authKey,
						base64.toArray(nonceb64),
					)
					return `tarnhelm ${base64.fromArray(signature)}`
				}

				const iv = new Uint8Array(12)
				const encryptMetadata: EncryptMetadata<M> = async (metadata) => {
					const encodedMetadata = new TextEncoder().encode(
						JSON.stringify(metadata),
					)
					const ciphertext = await crypto.ece.encrypt(
						iv,
						metadataKey,
						encodedMetadata,
					)
					return base64.fromArray(ciphertext)
				}
				const decryptMetadata: DecryptMetadata<M> = async (metadatab64) => {
					const plaintext = await crypto.ece.decrypt(
						iv,
						metadataKey,
						base64.toArray(metadatab64),
					)
					const decodedMetadata = new TextDecoder().decode(plaintext)
					return JSON.parse(decodedMetadata) as M
				}

				const salt = crypto.ece.generateSalt()
				const encryptStream: EncryptStream = async (stream) =>
					crypto.ece.encryptStream(salt, secret, stream)
				const decryptStream: DecryptStream = (stream) =>
					crypto.ece.decryptStream(secret, stream)

				setKeyring({
					secretb64: base64.fromArray(secret),
					authb64,
					sign,
					encryptMetadata,
					decryptMetadata,
					encryptStream,
					decryptStream,
					calculateEncryptedSize: crypto.ece.calculateEncryptedSize,
				})
			}

			void createKeyring()
		}
	}, [crypto, secretb64])

	return keyring
}
