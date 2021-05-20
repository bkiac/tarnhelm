import express from "express"
import {storageRouter} from "./storage"

export const router = express
	.Router()
	.get("/ping", (_, res) => res.send())
	.use("/", storageRouter)
