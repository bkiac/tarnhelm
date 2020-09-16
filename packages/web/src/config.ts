export type Config = {
	api: string
	ws: string
}

const api = process.env.NEXT_PUBLIC_API_URL ?? ""
const ws = process.env.NEXT_PUBLIC_WS_URL ?? ""

export const config = {
	api,
	ws,
}
