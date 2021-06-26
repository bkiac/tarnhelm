import {css, keyframes} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"
import type {EmotionAnimationSnippet} from "./utils"

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

export type TwitchArgs = TwitchAnimationProperties

export const twitchSnippet: EmotionAnimationSnippet<TwitchArgs> = ({
	duration,
	delay,
}) => [twitchKeyframes, `${duration}s ${delay}s infinite`]

export function twitch(args: TwitchArgs): SerializedStyles {
	const [snippetKeyframes, properties] = twitchSnippet(args)
	return css`
		animation: ${snippetKeyframes} ${properties};
	`
}
