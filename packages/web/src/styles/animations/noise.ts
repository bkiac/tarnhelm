import {css, keyframes} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"
import type {EmotionAnimationSnippet} from "./utils"

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

export const noiseSnippet: EmotionAnimationSnippet<NoiseArgs> = ({
	duration,
	...args
}) => [
	createNoiseKeyframes(args),
	`${duration}s linear infinite alternate-reverse`,
]

export function noise(args: NoiseArgs): SerializedStyles {
	const [keyframesBefore, propertiesBefore] = noiseSnippet(args)
	const [keyframesAfter, propertiesAfter] = noiseSnippet(args)
	return css`
		&:before {
			animation: ${keyframesBefore} ${propertiesBefore};
		}
		&:after {
			animation: ${keyframesAfter} ${propertiesAfter};
		}
	`
}
