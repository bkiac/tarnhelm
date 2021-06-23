import {css, keyframes} from "styled-components"
import type {FlattenSimpleInterpolation, Keyframes} from "styled-components"

export type NoiseKeyframesArgs = {
	steps: number
	fraction: number
}

export function createNoiseKeyframes({
	steps,
	fraction,
}: NoiseKeyframesArgs): Keyframes {
	const partials = Array.from(Array(steps)).map((_, i) => {
		const top = Math.random()
		const bottom = 1.01 - top
		const percentage = i * (1 / steps)

		const insetTop = top / fraction
		const insetBottom = bottom / fraction

		return css`
			${percentage * 100}% {
				clip-path: inset(${insetTop}em 0 ${insetBottom}em 0);
			}
		`
	})
	return keyframes`
		${partials}
	`
}

export type NoiseAnimationProperties = {duration: number}

export type NoiseArgs = NoiseKeyframesArgs & NoiseAnimationProperties

export function noiseSnippet({
	duration,
	...args
}: NoiseArgs): FlattenSimpleInterpolation {
	const noiseKeyframes = createNoiseKeyframes(args)
	return css`
		${noiseKeyframes} ${duration}s linear infinite alternate-reverse
	`
}

export function noise(args: NoiseArgs): FlattenSimpleInterpolation {
	return css`
		&:before {
			animation: ${noiseSnippet(args)};
		}
		&:after {
			animation: ${noiseSnippet(args)};
		}
	`
}
