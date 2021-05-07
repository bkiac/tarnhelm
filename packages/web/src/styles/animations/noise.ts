import type {FlattenSimpleInterpolation, Keyframes} from "styled-components"
import {css, keyframes} from "styled-components"

function createNoiseKeyframePartials(
	steps: number,
	fraction: number,
): (FlattenSimpleInterpolation | string)[] {
	return Array.from(Array(steps)).map((_, i) => {
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
}

function createNoiseKeyframes(steps: number, fraction: number): Keyframes {
	return keyframes`
    ${createNoiseKeyframePartials(steps, fraction)}
  `
}

export function noise(opts: {
	duration: number
	steps: number
	fraction?: number
}): FlattenSimpleInterpolation {
	const {duration, steps, fraction = 1} = opts
	return css`
		${createNoiseKeyframes(
			steps,
			fraction,
		)} ${duration}s linear infinite alternate-reverse
	`
}
