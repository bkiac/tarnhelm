import {css, keyframes} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"

export type GlitchAnimationUnit = "em" | "px"

function createGlitchKeyframes(
	size: number,
	unit: GlitchAnimationUnit,
): Keyframes {
	const value = `${size}${unit}`
	return keyframes`
		0% {
			transform: translate(0);
		}
		20% {
			transform: translate(-${value}, ${value});
		}
		40% {
			transform: translate(-${value}, -${value});
		}
		60% {
			transform: translate(${value}, ${value});
		}
		80% {
			transform: translate(${value}, -${value});
		}
		to {
			transform: translate(0);
		}
	`
}

export function glitch({
	size,
	duration,
	unit = "em",
	direction = "normal",
}: {
	size: number
	duration: number
	unit?: GlitchAnimationUnit
	direction?: "normal" | "reverse"
}): SerializedStyles {
	const gkfs = createGlitchKeyframes(size, unit)
	return css`
		${gkfs} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${direction} both infinite
	`
}
