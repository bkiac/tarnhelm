import express from "express"
import {router as stashRouter} from "./stash"

export const router = express
	.Router()
	.get("/ping", (_, res) => res.send())
	.use("/", stashRouter)
