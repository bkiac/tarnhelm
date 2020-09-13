import random from "lodash.random"
import sampleSize from "lodash.samplesize"

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
	let availablePositions = Array.from(str, (v, i) => i)
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
