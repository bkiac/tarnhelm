import express from "express"
import expressWs from "express-ws"

// Augment Express app with a WebSocket server
const { app, getWss } = expressWs(express())

const wexpress = {
	app,
	wss: getWss(),
}

export default wexpress
