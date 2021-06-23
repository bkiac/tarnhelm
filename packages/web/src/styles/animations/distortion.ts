import {css} from "styled-components"
import type {FlattenSimpleInterpolation} from "styled-components"
import type {NoiseArgs} from "./noise"
import {noise} from "./noise"
import type {TwitchArgs} from "./twitch"
import {twitch} from "./twitch"

export type DistortionArgs = {
	noise: NoiseArgs
	twitch: TwitchArgs & {delayDelta: number}
}

export function distortion(args: DistortionArgs): FlattenSimpleInterpolation {
	const delayedTwitchArgs = {
		...args.twitch,
		delay: args.twitch.delay + args.twitch.delayDelta,
	}
	return css`
		animation: ${twitch(args.twitch)}};
		&:before {
			animation: ${noise(args.noise)}, ${twitch(args.twitch)}};
		}
		&:after {
			animation: ${noise(args.noise)}, ${twitch(delayedTwitchArgs)};
		}
	`
}
