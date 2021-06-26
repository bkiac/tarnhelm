import {css} from "@emotion/react"
import type {SerializedStyles} from "@emotion/react"
import type {NoiseArgs} from "./noise"
import {noiseSnippet} from "./noise"
import type {TwitchArgs} from "./twitch"
import {twitchSnippet} from "./twitch"

export type DistortionArgs = {
	noise: NoiseArgs
	twitch: TwitchArgs & {delayDelta: number}
}

export function distortion(args: DistortionArgs): SerializedStyles {
	const [mainTwitchKeyframes, mainTwitchProperties] = twitchSnippet(args.twitch)

	const [noiseBeforeKeyframes, noiseBeforeProperties] = noiseSnippet(args.noise)
	const [twitchBeforeKeyframes, twitchBeforeProperties] = twitchSnippet(
		args.twitch,
	)

	const [noiseAfterKeyframes, noiseAfterProperties] = noiseSnippet(args.noise)
	const [twitchAfterKeyframes, twitchAfterProperties] = twitchSnippet({
		...args.twitch,
		delay: args.twitch.delay + args.twitch.delayDelta,
	})

	return css`
		animation: ${mainTwitchKeyframes} ${mainTwitchProperties};
		&:before {
			animation: ${noiseBeforeKeyframes} ${noiseBeforeProperties},
				${twitchBeforeKeyframes} ${twitchBeforeProperties};
		}
		&:after {
			animation: ${noiseAfterKeyframes} ${noiseAfterProperties},
				${twitchAfterKeyframes} ${twitchAfterProperties};
		}
	`
}
