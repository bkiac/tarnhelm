/** Utility functions to be used for authorization and AES-128-GCM content encryption. */
import isString from "lodash/isString"
import type {ByteArray} from "./util"

/** Imports a key from external, portable material. */
export async function importKey(ikm: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveKey"])
}

export type KeysmithAlgorithmParams = {
	salt: ByteArray
	info: ByteArray | string
}

/**
 * Derive a key from a master key.
 */
export async function deriveKey(
	{salt, info}: KeysmithAlgorithmParams,
	masterKey: CryptoKey,
	derivedKeyType:
		| string
		| AesDerivedKeyParams
		| HmacImportParams
		| ConcatParams
		| HkdfParams
		| Pbkdf2Params,
	keyUsages: KeyUsage[],
): Promise<CryptoKey> {
	return crypto.subtle.deriveKey(
		{
			name: "HKDF",
			salt,
			info: isString(info) ? new TextEncoder().encode(info) : info,
			hash: "SHA-256",
		},
		masterKey,
		derivedKeyType,
		true,
		keyUsages,
	)
}

export type DeriveKey = (
	algorithm: KeysmithAlgorithmParams,
	masterKey: CryptoKey,
) => Promise<CryptoKey>

export const deriveEncryptionKey: DeriveKey = async (algorithm, masterKey) =>
	deriveKey(
		algorithm,
		masterKey,
		{
			name: "AES-GCM",
			length: 128,
		},
		["encrypt", "decrypt"],
	)

export const deriveAuthenticationKey: DeriveKey = async (
	algorithm,
	masterKey,
) =>
	deriveKey(
		algorithm,
		masterKey,
		{
			name: "HMAC",
			hash: {name: "SHA-256"},
		},
		["sign"],
	)

export type GenerateKey = (
	salt: ByteArray,
	keyData: Uint8Array | CryptoKey,
) => Promise<CryptoKey>

export async function generateKey(
	algorithm: KeysmithAlgorithmParams,
	keyData: Uint8Array | CryptoKey,
	keyDerivationFn: DeriveKey,
): Promise<CryptoKey> {
	const masterKey =
		keyData instanceof Uint8Array ? await importKey(keyData) : keyData
	return keyDerivationFn(algorithm, masterKey)
}

export const generateAuthenticationKey: GenerateKey = async (salt, keyData) =>
	generateKey({salt, info: "Authentication"}, keyData, deriveAuthenticationKey)

export const generateMetadataEncryptionKey: GenerateKey = async (
	salt,
	keyData,
) => generateKey({salt, info: "Metadata"}, keyData, deriveEncryptionKey)

export const generateContentEncryptionKey: GenerateKey = async (
	salt,
	keyData,
) =>
	generateKey(
		{salt, info: "Content-Encoding: aes128gcm\0"},
		keyData,
		deriveEncryptionKey,
	)

export const generateNonceKey: GenerateKey = async (salt, keyData) =>
	generateKey(
		{salt, info: "Content-Encoding: nonce\0"},
		keyData,
		deriveEncryptionKey,
	)

export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
	return crypto.subtle.exportKey("raw", key)
}
