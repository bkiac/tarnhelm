import {css, keyframes} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"
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

export type GlitchWidth = CssUnitValue | string

export type GlitchAnimationProperties = {
	duration: number
	direction: "normal" | "reverse"
}

export type GlitchSnippetArgs = {width: GlitchWidth} & GlitchAnimationProperties

export function glitchSnippet({
	width,
	duration,
	direction,
}: GlitchSnippetArgs): [Keyframes, string] {
	return [
		createGlitchKeyframes(width),
		`${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${direction} both infinite`,
	]
}

export type GlitchArgs = Omit<GlitchSnippetArgs, "direction">

export function glitch(args: GlitchArgs): SerializedStyles {
	const [keyframesBefore, optionsBefore] = glitchSnippet({
		...args,
		direction: "normal",
	})
	const [keyframesAfter, optionsAfter] = glitchSnippet({
		...args,
		direction: "reverse",
	})
	return css`
		&:before {
			animation: ${keyframesBefore} ${optionsBefore};
		}
		&:after {
			animation: ${keyframesAfter} ${optionsAfter};
		}
	`
}
