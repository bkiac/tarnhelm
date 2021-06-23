/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {firefox} from "playwright"
import type {FirefoxBrowser, Page} from "playwright"

let browser: FirefoxBrowser
let page: Page

beforeAll(async () => {
	browser = await firefox.launch()
})
afterAll(async () => browser.close())

beforeEach(async () => {
	page = await browser.newPage()
})
afterEach(async () => page.close())

it("runs ece", async () => {
	// didnt work, browserCrypto is an empty object
	// const browserCrypto = await page.evaluate(() => ({ ...window.crypto }))
	// console.log(browserCrypto.getRandomValues(new Uint8Array(8)))

	// const cryptoHandle = await page.evaluateHandle(() => window.crypto)
	// console.log(cryptoHandle..getRandomValues(new Uint8Array(8)))

	// crypto.getRandomValues(new Uint8Array(8))

	// await page.exposeBinding("generateIkm", () => "nincs crypto az a baj")

	// Can't pass crypto as handle
	// await page.exposeBinding(
	// 	"generateIkm",
	// 	(source, crypto: Crypto) =>
	// 		crypto.getRandomValues(new Uint8Array(8)).toString(),
	// 	{ handle: true },
	// )

	// Can't pass crypto as function arg
	// await page.exposeFunction("generateIkm", (crypto: Crypto) =>
	// 	crypto.getRandomValues(new Uint8Array(8)).toString(),
	// )

	// void crypto.subtle.importKey("raw", new Uint8Array(8), "HKDF", false, [
	// 	"deriveKey",
	// ])

	// Crashes: `window.crypto.subtle` is `undefined`
	// const cryptokey = await page.evaluate(async () => {
	// 	const key = await window.crypto.subtle.importKey(
	// 		"raw",
	// 		crypto.getRandomValues(new Uint8Array(8)),
	// 		"HKDF",
	// 		false,
	// 		["deriveKey"],
	// 	)
	// 	return key
	// })
	// console.log(cryptokey)

	const random = await page.evaluate(() =>
		crypto.getRandomValues(new Uint8Array(8)),
	)
	console.log(random)

	await page.setContent(`
    <script>
      async function onClick() {
				// document.querySelector('div').textContent = window.crypto.getRandomValues(new Uint8Array(8)).toString();
				document.querySelector('div').textContent = await window.crypto.subtle.importKey("raw", new Uint8Array(8), "HKDF", false, [
					"deriveKey",
				])
      }
    </script>
    <button onclick="onClick()">Click me</button>
		<div></div>
		<p>it should work</p>
  `)
	await page.click("button")
	const text = await page.textContent("div")
	const text2 = await page.textContent("p")
	console.log(text, text2)
})
