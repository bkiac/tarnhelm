import { generateRandom } from "../utils"
import { KEY_LENGTH } from "./constants"

export function generateSalt(): ArrayBuffer {
	return generateRandom(KEY_LENGTH).buffer
}

export function generateIkm(): Uint8Array {
	return generateRandom(KEY_LENGTH)
}
