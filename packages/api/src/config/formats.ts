/* eslint-disable no-console */
import convict from "convict"
import { isString } from "lodash"
import restrictedPorts from "./restrictedPorts"

export default function addCustomFormats(): void {
	convict.addFormats({
		string: {
			validate: (value) => {
				if (!isString(value) || value === "") {
					throw new Error("must be a non-empty string")
				}
			},
		},

		/** The port can be used by the WebSocket API and is not restricted in a browser. */
		"websocket-port": {
			coerce: (value) => parseInt(value, 10),
			validate: (value) => {
				if (restrictedPorts.includes(value)) {
					throw new Error("port is restricted in a browser")
				}
			},
		},
	})
}
