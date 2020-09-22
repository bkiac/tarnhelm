import * as ece from "./ece"
import { generateRandom } from "./utils"

export type Crypto = {
	web: typeof window.crypto
	ece: typeof ece
	generateRandom: typeof generateRandom
}

export const web = window.crypto
export { ece, generateRandom }
