import type { FlattenSimpleInterpolation, Keyframes } from "styled-components"
import { css, keyframes } from "styled-components"

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
	unit = "em",
	duration,
	direction = "normal",
}: {
	size: number
	unit?: GlitchAnimationUnit
	duration: number
	direction?: "normal" | "reverse"
}): FlattenSimpleInterpolation {
	const gkfs = createGlitchKeyframes(size, unit)
	return css`
		${gkfs} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${direction} both infinite;
	`
}
