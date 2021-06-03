import {css, keyframes} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"

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
}: NoiseArgs): [Keyframes, string] {
	const noiseKeyframes = createNoiseKeyframes(args)
	return [noiseKeyframes, `${duration}s linear infinite alternate-reverse`]
}

export function noise(args: NoiseArgs): SerializedStyles {
	const [keyframesBefore, optionsBefore] = noiseSnippet(args)
	const [keyframesAfter, optionsAfter] = noiseSnippet(args)
	return css`
		&:before {
			animation: ${keyframesBefore} ${optionsBefore};
		}
		&:after {
			animation: ${keyframesAfter} ${optionsAfter};
		}
	`
}
