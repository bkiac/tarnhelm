import cors from "cors"
import cron from "cron"
import { config } from "./config"
import * as storage from "./lib/storage/storage"
import { wexpress } from "./lib/wexpress"
import { router } from "./routes"
import { asAsyncListener, createStatsLogger, log } from "./utils"

export async function start(): Promise<void> {
	await storage.clean()
	const storageCleaningJob = new cron.CronJob(
		"0 0 * * *",
		asAsyncListener(storage.clean),
	)
	storageCleaningJob.start()

	const { app, wss } = wexpress

	app.use(cors())
	app.use(router)

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
