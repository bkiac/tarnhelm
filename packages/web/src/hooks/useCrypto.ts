import {useEffect, useState} from "react"
import type {Crypto} from "../lib/crypto"

export function useCrypto(): Crypto | undefined {
	const [crypto, setCrypto] = useState<Crypto>()
	useEffect(() => {
		async function load(): Promise<void> {
			const loadedCrypto = await import("../lib/crypto")
			setCrypto(loadedCrypto)
		}
		void load()
	}, [])
	return crypto
}
