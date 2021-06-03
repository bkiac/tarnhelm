import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
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

const twitchAnimation = twitch(twitchOptions)

const glitchAnimationBefore = css`
	${noise(noiseOptions)}, ${twitch({
		...twitchOptions,
		delay: twitchOptions.delay + 0.05,
	})}
`

const glitchAnimationAfter = css`
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
		animation: ${twitchAnimation};

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
			animation: ${glitchAnimationBefore};
		}

		&:after {
			left: 2px;
			text-shadow: -0.05em 0 ${props.theme.palette.primary};
			animation: ${glitchAnimationAfter};
		}
	`,
)

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<StyledAppTitle content={title}>{title}</StyledAppTitle>
	</InternalLink>
)
