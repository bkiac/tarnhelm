import express from "express"
import expressWs from "express-ws"

/**
 * Set up Express and WebSocket server before loading and defining routes
 * https://github.com/HenningM/express-ws#usage
 */

// Augment Express app with a WebSocket server
const instance = expressWs(express())

const wexpress = {
	app: instance.app,
	wss: instance.getWss(),
}

export default wexpress
