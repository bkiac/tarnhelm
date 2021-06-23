import React from "react"
import styled, {css} from "styled-components"
import type {FlattenSimpleInterpolation} from "styled-components"
import {noise, twitch} from "../styles/animations"
import {A} from "./A"
import {InternalLink} from "./InternalLink"

const twitchAnimationProperties = {
	duration: 5,
	delay: 5,
}
const twitchLargerDelayAnimationProperties = {
	duration: twitchAnimationProperties.duration,
	delay: twitchAnimationProperties.delay + 0.05,
}

const noiseKeyframesArgs = {
	steps: 30,
	fraction: 2,
}
const noiseAnimationProperties = {
	duration: 8,
}
const noiseArgs = [noiseKeyframesArgs, noiseAnimationProperties] as const

const noiseAndTwitchAnimationBefore = (): FlattenSimpleInterpolation =>
	css`
		animation: ${noise(...noiseArgs)}, ${twitch(twitchAnimationProperties)};
	`

const noiseAndTwitchAnimationAfter = (): FlattenSimpleInterpolation =>
	css`
		animation: ${noise(...noiseArgs)},
			${twitch(twitchLargerDelayAnimationProperties)};
	`

const StyledAppTitle = styled.span<{
	content: string
}>(
	(props) => css`
		margin: 0;
		font-size: 2.5rem;
		font-family: "Roboto Condensed", sans-serif;
		font-style: italic;
		font-weight: 700;
		text-transform: uppercase;
		color: ${props.theme.palette.foreground};
		position: relative;
		animation: ${twitch(twitchAnimationProperties)};

		&:before,
		&:after {
			content: "${props.content}";
			position: absolute;
			top: 0;
			overflow: hidden;
			background: ${props.theme.palette.background};
		}

		&:before {
			left: -2px;
			text-shadow: -0.05em 0 ${props.theme.palette.tertiary};
			${noiseAndTwitchAnimationBefore()}
		}

		&:after {
			left: 2px;
			text-shadow: -0.05em 0 ${props.theme.palette.primary};
			${noiseAndTwitchAnimationAfter()}
		}
	`,
)

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<StyledAppTitle content={title}>{title}</StyledAppTitle>
	</InternalLink>
)
