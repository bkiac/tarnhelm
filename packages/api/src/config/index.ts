/* eslint-disable no-console */
import convict from "convict"
import { ONE_DAY_IN_SECONDS } from "../utils"
import addCustomFormats from "./formats"

addCustomFormats()

const config = convict({
	env: {
		doc: "The application environment.",
		format: ["production", "development", "test"],
		default: "development",
		env: "NODE_ENV",
	},

	port: {
		doc: "The port to bind.",
		format: "websocket-port",
		default: 7089,
		env: "PORT",
	},

	redis: {
		url: {
			doc: "The Redis server URL.",
			format: "string",
			default: "",
			sensitive: true,
			env: "REDIS_URL",
		},
	},

	s3: {
		endpoint: {
			doc: "The S3 endpoint.",
			format: "string",
			default: "",
			sensitive: true,
			env: "S3_ENDPOINT",
		},
		bucket: {
			doc: "The S3 bucket.",
			format: "string",
			default: "",
			sensitive: true,
			env: "S3_BUCKET",
		},
		accessKey: {
			id: {
				doc: "The S3 access key ID.",
				format: "string",
				default: "",
				sensitive: true,
				env: "S3_ACCESS_KEY_ID",
			},
			secret: {
				doc: "The S3 access key secret.",
				format: "string",
				default: "",
				sensitive: true,
				env: "S3_ACCESS_KEY_SECRET",
			},
		},
	},

	storage: {
		downloads: {
			def: {
				doc: "Default number of downloads.",
				format: Number,
				default: 1,
				env: "STORAGE_DEFAULT_DOWNLOADS",
			},
			max: {
				doc: "Number of max downloads.",
				format: Number,
				default: 200,
				env: "STORAGE_MAX_DOWNLOADS",
			},
		},

		expiry: {
			def: {
				doc: "Default expiry in seconds.",
				format: Number,
				default: ONE_DAY_IN_SECONDS,
				env: "STORAGE_DEFAULT_EXPIRY",
			},
			max: {
				doc: "Max expiry in seconds.",
				format: Number,
				default: 14 * ONE_DAY_IN_SECONDS,
				env: "STORAGE_MAX_EXPIRY",
			},
		},

		fileSize: {
			max: {
				doc: "Max file size in bytes.",
				format: Number,
				default: 5 * 1024 * 1024 * 1024, // 5GB
				env: "STORAGE_MAX_FILE_SIZE",
			},
		},
	},
})

console.log("⚙️ Config has been loaded:", config.toString())
config.validate({ allowed: "strict" })

export default config
