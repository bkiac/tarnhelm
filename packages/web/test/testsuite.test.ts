/* eslint-disable no-console */
import {webkit} from "playwright"
import type {Page, WebKitBrowser} from "playwright"

let browser: WebKitBrowser
let page: Page

beforeAll(async () => {
	browser = await webkit.launch()
})
afterAll(async () => browser.close())

beforeEach(async () => {
	page = await browser.newPage()
})
afterEach(async () => page.close())

it("runs", () => {
	console.log("runs")
})
