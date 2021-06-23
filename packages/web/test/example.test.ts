/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {webkit} from "playwright"
import type {Page, WebKitBrowser} from "playwright"
import {importKey, importKeyWithoutArgs} from "../src/lib/ece/keys"
// import { importKey, importKeyWithoutArgs } from "./keys"

let browser: WebKitBrowser
let page: Page

async function localImportKeyWithoutArgs(): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", new Uint8Array(8), "HKDF", false, [
		"deriveKey",
	])
}

async function localImportKey(ikm: Uint8Array): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveKey"])
}

async function testImportKey(): Promise<boolean> {
	return (await importKey(new Uint8Array(8))).extractable
}

beforeAll(async () => {
	browser = await webkit.launch()
})
afterAll(async () => browser.close())

beforeEach(async () => {
	page = await browser.newPage()
})
afterEach(async () => page.close())

it("runs local without args", async () => {
	const ok = await page.evaluate(localImportKeyWithoutArgs)
	console.log(ok.algorithm, ok.extractable, ok.type, ok.usages)
})

it("runs imported without args", async () => {
	const err = await page.evaluate(importKeyWithoutArgs)
	console.log(err)
})

it("runs local with args", async () => {
	const err = await page.evaluate(localImportKey, new Uint8Array(8))
	console.log(err)
})

it("runs imported with args", async () => {
	const err = await page.evaluate(importKey, new Uint8Array(8))
	console.log(err)
})

it("runs and returns crypto key", async () => {
	const extractable = await page.evaluate(testImportKey)
	console.log(extractable)
})
