import express from "express"
import type expressWs from "express-ws"
import { storage } from "../handlers"

export const storageRouter: expressWs.Router = express
	.Router()
	.ws("/upload", storage.upload)
	.get("/download/:id", storage.download)
	.get("/metadata/:id", storage.getMetadata)
