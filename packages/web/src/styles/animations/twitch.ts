import {css, keyframes} from "styled-components"
import type {FlattenSimpleInterpolation} from "styled-components"

export const twitchKeyframes = keyframes`
	1% {
		transform: rotateX(10deg) skewX(60deg);
	}
	2% {
		transform: rotateX(0deg) skewX(0deg);
	}
`

export type TwitchAnimationProperties = {
	duration: number
	delay: number
}

export function twitch({
	duration,
	delay,
}: TwitchAnimationProperties): FlattenSimpleInterpolation {
	return css`
		${twitchKeyframes} ${duration}s ${delay}s infinite
	`
}
