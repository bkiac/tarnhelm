import {keyframes} from "@emotion/react"

/** Use with `${twitch} ${duration}s ${delay}s infinite` */
export const twitch = keyframes`
	1% {
		transform: rotateX(10deg) skewX(60deg);
	}
	2% {
		transform: rotateX(0deg) skewX(0deg);
	}
`
