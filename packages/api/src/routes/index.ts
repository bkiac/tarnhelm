import express from "express"
import {storageRouter} from "./storage"

export const router = express
	.Router()
	.get("/ping", (req, res) => res.send())
	.use("/", storageRouter)
