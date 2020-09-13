import cors from "cors"
import cron from "cron"
import config from "./config"
import * as storage from "./lib/storage/storage"
import express from "./lib/wexpress"
import routes from "./routes"
import { createStatsLogger, log } from "./utils"

export async function start(): Promise<void> {
	await storage.clean()
	const storageCleaningJob = new cron.CronJob("0 0 * * *", () => {
		storage.clean().then(
			() => {},
			() => {},
		)
	})
	storageCleaningJob.start()

	const { app, wss } = express

	app.use(cors())
	app.use(routes)

	const logStats = createStatsLogger()
	wss.on("connection", (client) => {
		logStats(wss, "A client has connected!")
		client.addEventListener("close", () => {
			logStats(wss, "A client has disconnected!")
		})
	})

	const port = config.get("port")
	app.listen(port, () => {
		log(`📡 Server is listening on port ${port}.`)
	})
}
