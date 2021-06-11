import {keyframes} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"

function createNoiseClipPaths(steps: number, fraction: number): string[] {
	return Array.from(Array(steps)).map((_, i) => {
		const top = Math.random()
		const bottom = 1.01 - top
		const percentage = i * (1 / steps)

		const insetTop = top / fraction
		const insetBottom = bottom / fraction

		return `
			${percentage * 100}% {
				clip-path: inset(${insetTop}em 0 ${insetBottom}em 0);
			}
		`
	})
}

/**
 * Use with `${createNoise(...)} ${duration}s linear infinite alternate-reverse`
 * For multiple noise animations on the same element to be visible,
 * create additional keyframes with this method (the returned noise is randomly generated), otherwise they will overlap.
 */
export function createNoise(steps: number, fraction: number): Keyframes {
	return keyframes`
		${createNoiseClipPaths(steps, fraction)}
	`
}
