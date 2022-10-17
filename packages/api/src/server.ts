import cors from "cors"
import cron from "cron"
import {config} from "./config"
import * as stash from "./lib/stash"
import {wexpress} from "./lib/wexpress"
import {router} from "./routes"
import {asAsyncListener, createStatsLogger, log} from "./utils"

export async function start(): Promise<void> {
	await stash.clean()
	const stashCleaningJob = new cron.CronJob(
		"0 0 * * *",
		asAsyncListener(stash.clean),
	)
	stashCleaningJob.start()

	const {app, wss} = wexpress

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
