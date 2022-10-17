import convict from "convict"
import {ONE_DAY_IN_SECONDS} from "../utils"
import {nonEmptyString, webSocketPort} from "./formats"

convict.addFormats({
	nonEmptyString,
	webSocketPort,
})

export const config = convict({
	env: {
		doc: "The application environment.",
		format: ["production", "development", "test"],
		default: "development",
		env: "NODE_ENV",
	},

	port: {
		doc: "The port to bind.",
		format: "webSocketPort",
		default: 7089,
		env: "PORT",
	},

	redis: {
		url: {
			doc: "The Redis server URL.",
			format: "nonEmptyString",
			default: "",
			sensitive: true,
			env: "REDIS_URL",
		},
	},

	s3: {
		endpoint: {
			doc: "The S3 endpoint.",
			format: "nonEmptyString",
			default: "",
			sensitive: true,
			env: "S3_ENDPOINT",
		},
		bucket: {
			doc: "The S3 bucket.",
			format: "nonEmptyString",
			default: "",
			sensitive: true,
			env: "S3_BUCKET",
		},
		accessKey: {
			id: {
				doc: "The S3 access key ID.",
				format: "nonEmptyString",
				default: "",
				sensitive: true,
				env: "S3_ACCESS_KEY_ID",
			},
			secret: {
				doc: "The S3 access key secret.",
				format: "nonEmptyString",
				default: "",
				sensitive: true,
				env: "S3_ACCESS_KEY_SECRET",
			},
		},
	},

	stash: {
		downloads: {
			def: {
				doc: "Default number of downloads.",
				format: Number,
				default: 1,
				env: "DEFAULT_DOWNLOADS",
			},
			max: {
				doc: "Number of max downloads.",
				format: Number,
				default: 200,
				env: "MAX_DOWNLOADS",
			},
		},

		expiry: {
			def: {
				doc: "Default expiry in seconds.",
				format: Number,
				default: ONE_DAY_IN_SECONDS,
				env: "DEFAULT_EXPIRY",
			},
			max: {
				doc: "Max expiry in seconds.",
				format: Number,
				default: 14 * ONE_DAY_IN_SECONDS,
				env: "MAX_EXPIRY",
			},
		},

		fileSize: {
			max: {
				doc: "Max file size in bytes.",
				format: Number,
				default: 5 * 1024 * 1024 * 1024, // 5GB
				env: "MAX_FILE_SIZE",
			},
		},
	},

	lnd: {
		socket: {
			doc: "The LND socket to connect to.",
			format: "nonEmptyString",
			default: "",
			sensitive: true,
			env: "LND_SOCKET",
		},
		cert: {
			doc: "The LND TLS certificate in base64.",
			format: String,
			default: "",
			sensitive: true,
			env: "LND_CERT",
		},
		macaroon: {
			doc: "The LND admin macaroon in base64.",
			format: "nonEmptyString",
			default: "",
			sensitive: true,
			env: "LND_MACAROON",
		},
	},
}).validate({allowed: "strict"})

// eslint-disable-next-line no-console
console.log("⚙️ Config has been loaded:", config.toString())
