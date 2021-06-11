import {keyframes} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"
import type {CssUnitValue} from "../../lib/css"
import {toCssText} from "../../lib/css"

/** Use with `${createGlitch(...)} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${normal | reverse} both infinite` */
export function createGlitch(args: CssUnitValue | string): Keyframes {
	let value = args
	if (typeof args !== "string") {
		value = toCssText(args.value, args.unit)
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
