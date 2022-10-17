import express from "express"
import type expressWs from "express-ws"
import * as stash from "../handlers/stash"

export const router: expressWs.Router = express
	.Router()
	.ws("/upload", stash.upload)
	.get("/download/:id", stash.download)
	.get("/metadata/:id", stash.getMetadata)
