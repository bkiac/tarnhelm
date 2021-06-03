import {css, keyframes} from "@emotion/react"
import type {Keyframes} from "@emotion/serialize"
import type {SerializedStyles} from "@emotion/react"

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

export function twitchSnippet({
	duration,
	delay,
}: TwitchArgs): [Keyframes, string] {
	return [twitchKeyframes, `${duration}s ${delay}s infinite`]
}

export function twitch(args: TwitchArgs): SerializedStyles {
	const [snippetKeyframes, properties] = twitchSnippet(args)
	return css`
		animation: ${snippetKeyframes} ${properties};
	`
}
