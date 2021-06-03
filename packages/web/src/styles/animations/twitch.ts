import {css, keyframes} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"

const twitchKeyframes = keyframes`
	1% {
		transform: rotateX(10deg) skewX(60deg);
	}
	2% {
		transform: rotateX(0deg) skewX(0deg);
	}
`

export function twitch(opts: {
	duration: number
	delay: number
}): SerializedStyles {
	const {duration, delay} = opts
	return css`
		${twitchKeyframes} ${duration}s ${delay}s infinite
	`
}
