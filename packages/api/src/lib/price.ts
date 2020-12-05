import * as coinGecko from "./coinGecko"

const satsPerBitcoin = 1e8
const usdPerByte = 2e-10

/**
 * Returns price quote in sats
 *
 * `expiry` and `downloadLimit` are disregarded for now
 */
export async function getPriceQuote({
	size,
}: {
	downloadLimit: number
	expiry: number
	size: number
}): Promise<number> {
	const bitcoinPrice = await coinGecko.getBitcoinPrice()
	const totalUsd = usdPerByte * size
	const usdPerSats = satsPerBitcoin / bitcoinPrice
	const totalSats = usdPerSats * totalUsd
	return totalSats < 1 ? 1 : Math.ceil(totalSats)
}
