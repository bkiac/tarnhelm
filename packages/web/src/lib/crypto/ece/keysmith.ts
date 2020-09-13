/** Utility functions to be used for authorization and AES-128-GCM content encryption. */

interface HKDFAlgorithmParams {
	salt: ArrayBuffer
	info: string
}

/** Imports a key from external, portable material. */
export async function importKey(ikm: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveKey"])
}

/**
 * Derive a key from a master key.
 * Compiler errors are suppressed because TypeScript doesn't recognize the HKDF algorithm.
 * https://developer.mozilla.org/en-US/docs/Web/API/HkdfParams
 */
export async function deriveKey(
	algorithmParams: HKDFAlgorithmParams,
	masterKey: CryptoKey,
	derivedKeyType:
		| string
		| AesDerivedKeyParams
		| HmacImportParams
		| ConcatParams
		| HkdfCtrParams
		| Pbkdf2Params,
	keyUsages: string[],
): Promise<CryptoKey> {
	/* eslint-disable @typescript-eslint/ban-ts-comment */
	const { salt, info } = algorithmParams
	return crypto.subtle.deriveKey(
		{
			name: "HKDF",
			salt,
			// @ts-expect-error
			info: new TextEncoder().encode(info),
			hash: "SHA-256",
		},
		masterKey,
		derivedKeyType,
		true,
		keyUsages,
	)
	/* eslint-enable */
}

type DeriveKey = (
	algorithmParams: HKDFAlgorithmParams,
	masterKey: CryptoKey,
) => Promise<CryptoKey>

export const deriveEncryptionKey: DeriveKey = async (
	algorithmParams,
	masterKey,
) => {
	return deriveKey(
		algorithmParams,
		masterKey,
		{
			name: "AES-GCM",
			length: 128,
		},
		["encrypt", "decrypt"],
	)
}

export const deriveAuthenticationKey: DeriveKey = async (
	algorithmParams,
	masterKey,
) => {
	return deriveKey(
		algorithmParams,
		masterKey,
		{
			name: "HMAC",
			hash: { name: "SHA-256" },
		},
		["sign"],
	)
}

type GenerateKey = (
	salt: ArrayBuffer,
	keyData: Uint8Array | CryptoKey,
) => Promise<CryptoKey>

export async function generateKey(
	algorithmParams: HKDFAlgorithmParams,
	keyData: Uint8Array | CryptoKey,
	keyDerivationFn: DeriveKey,
): Promise<CryptoKey> {
	const masterKey =
		keyData instanceof Uint8Array ? await importKey(keyData) : keyData
	return keyDerivationFn(algorithmParams, masterKey)
}

export const generateAuthenticationKey: GenerateKey = async (salt, keyData) => {
	return generateKey(
		{ salt, info: "Authentication" },
		keyData,
		deriveAuthenticationKey,
	)
}

export const generateMetadataEncryptionKey: GenerateKey = async (
	salt,
	keyData,
) => {
	return generateKey({ salt, info: "Metadata" }, keyData, deriveEncryptionKey)
}

export const generateContentEncryptionKey: GenerateKey = async (
	salt,
	keyData,
) => {
	return generateKey(
		{ salt, info: "Content-Encoding: aes128gcm\0" },
		keyData,
		deriveEncryptionKey,
	)
}

export const generateNonceKey: GenerateKey = async (salt, keyData) => {
	return generateKey(
		{ salt, info: "Content-Encoding: nonce\0" },
		keyData,
		deriveEncryptionKey,
	)
}

export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
	return crypto.subtle.exportKey("raw", key)
}
