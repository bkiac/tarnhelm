import {isString} from "lodash"
import type convict from "convict"
import {restrictedPorts} from "./restrictedPorts"

export const nonEmptyString: convict.Format = {
	validate: (value) => {
		if (!isString(value) || value === "") {
			throw new Error("must be a non-empty string")
		}
	},
}

/** The port can be used by the WebSocket API and is not restricted in a browser. */
export const webSocketPort: convict.Format = {
	coerce: (value) => parseInt(value, 10),
	validate: (value) => {
		if (restrictedPorts.includes(value)) {
			throw new Error("port is restricted in a browser")
		}
	},
}
