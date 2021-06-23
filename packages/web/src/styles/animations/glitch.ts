import {css, keyframes} from "styled-components"
import type {FlattenSimpleInterpolation, Keyframes} from "styled-components"
import type {CssUnitValue} from "../../lib/css"
import {toCssText} from "../../lib/css"

export function createGlitchKeyframes(width: CssUnitValue | string): Keyframes {
	let value = width
	if (typeof width !== "string") {
		value = toCssText(width.value, width.unit)
	}
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

export type GlitchAnimationProperties = {
	duration: number
	direction?: "normal" | "reverse"
}

export function glitch(
	width: CssUnitValue | string,
	{duration, direction = "normal"}: GlitchAnimationProperties,
): FlattenSimpleInterpolation {
	const glitchKeyframes = createGlitchKeyframes(width)
	return css`
		${glitchKeyframes} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${direction} both infinite
	`
}
