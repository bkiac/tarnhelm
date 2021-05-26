import random from "lodash/random"
import sampleSize from "lodash/sampleSize"

export function isAnyLoading(...bools: boolean[]): boolean {
	return bools.some((loading) => loading)
}

export function replaceAt(
	str: string,
	replacement: string,
	index: number,
): string {
	return str.substring(0, index) + replacement + str.substring(index + 1)
}

export function obfuscate(
	str: string,
	rounds = str.length,
	symbols = "*+-_/@$%!XO1&<>[]{}",
): string[] {
	const obfuscatedStrings: string[] = [str]
	let availablePositions = Array.from(str, (_, i) => i)
	const numOfPlucksPerIteration = Math.floor(str.length / rounds)
	const numOfPlucksOnFirstIteration =
		numOfPlucksPerIteration + (str.length % rounds)

	for (let i = 1; i <= rounds; i++) {
		const numOfPlucks =
			i === 1 ? numOfPlucksOnFirstIteration : numOfPlucksPerIteration
		const positionsToObfuscate = sampleSize(availablePositions, numOfPlucks)
		availablePositions = availablePositions.filter(
			(p) => !positionsToObfuscate.includes(p),
		)
		const obfuscatedString = positionsToObfuscate.reduce<string>(
			(os, p) => replaceAt(os, symbols[random(symbols.length - 1)], p),
			obfuscatedStrings[i - 1],
		)
		obfuscatedStrings.push(obfuscatedString)
	}

	return obfuscatedStrings
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024

export const ONE_MINUTE = 60
export const ONE_HOUR = 60 * ONE_MINUTE
export const ONE_DAY = 24 * ONE_HOUR
export const ONE_WEEK = 7 * ONE_DAY

export const expiryOptions = [
	{
		value: 5 * ONE_MINUTE,
		label: "5 minutes",
	},
	{
		value: ONE_HOUR,
		label: "1 hour",
	},
	{
		value: ONE_DAY,
		label: "1 day",
	},
	{
		value: ONE_WEEK,
		label: "1 week",
	},
	{
		value: 2 * ONE_WEEK,
		label: "2 weeks",
	},
]

export const downloadLimitOptions = [
	{
		value: 1,
	},
	{
		value: 2,
	},
	{
		value: 3,
	},
	{
		value: 5,
	},
	{
		value: 20,
	},
	{
		value: 100,
	},
	{
		value: 200,
	},
]
