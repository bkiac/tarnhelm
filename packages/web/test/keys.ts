export async function importKey(ikm: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveKey"])
}

export async function importKeyWithoutArgs(): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", new Uint8Array(8), "HKDF", false, [
		"deriveKey",
	])
}
