import cors from "cors"
import cron from "cron"
import config from "./config"
import * as storage from "./lib/storage"
/**
 * Set up Express and WebSocket server before loading and defining routes
 * https://github.com/HenningM/express-ws#usage
 */
import express from "./lib/wexpress"
import routes from "./routes"
import { createStatsLogger, log } from "./utils"

;

(async () => {
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
})()
