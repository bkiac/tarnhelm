/* eslint-disable no-console */
import * as ts from "typescript"

beforeAll(() => {
	const program = ts.createProgram(["src/lib/ece/index.ts"], {
		module: ts.ModuleKind.System,
		outFile: "test/ece.js",
	})
	program.emit()
})

it("runs", () => {
	console.log("runs")
})
