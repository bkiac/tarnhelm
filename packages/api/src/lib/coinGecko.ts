import p from "phin"

export async function getBitcoinPrice(): Promise<number> {
	return (JSON.parse(
		(
			await p(
				"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
			)
		).body,
	) as { bitcoin: { usd: number } }).bitcoin.usd
}
