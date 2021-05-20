import React from "react"
import styled, {css} from "styled-components"
import type {FlattenSimpleInterpolation} from "styled-components"
import {noise, twitch} from "../styles/animations"
import {A} from "./A"
import {InternalLink} from "./InternalLink"

const twitchOptions = {
	duration: 5,
	delay: 5,
}
const noiseOptions = {
	duration: 8,
	steps: 30,
	fraction: 2,
}

const glitchAnim1 = (): FlattenSimpleInterpolation =>
	css`
		${noise(noiseOptions)}, ${twitch({
			...twitchOptions,
			delay: twitchOptions.delay + 0.05,
		})}
	`
const glitchAnim2 = (): FlattenSimpleInterpolation =>
	css`
		${noise(noiseOptions)}, ${twitch(twitchOptions)}
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
		animation: ${twitch(twitchOptions)};

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
			animation: ${glitchAnim1};
		}

		&:after {
			left: 2px;
			text-shadow: -0.05em 0 ${props.theme.palette.primary};
			animation: ${glitchAnim2};
		}
	`,
)

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<StyledAppTitle content={title}>{title}</StyledAppTitle>
	</InternalLink>
)
