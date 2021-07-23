import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {distortion} from "../styles/animations"
import {A} from "./A"
import {InternalLink} from "./InternalLink"

const distortionArgs = {
	twitch: {
		duration: 5,
		delay: 5,
		delayDelta: 0.05,
	},
	noise: {
		steps: 30,
		fraction: 2,
		duration: 8,
	},
}

const StyledAppTitle = styled.span<{
	content: string
}>((props) => {
	const fontSize = props.theme.fontSizes["4xl"]
	return css`
		display: inline-block;

		font-size: ${fontSize};
		// line-height must equal font-size; if line-height is larger than font-size the noise animation may not be fully visible because noise animation inset is in em
		line-height: ${fontSize};
		font-family: ${props.theme.fonts.brand};
		font-style: italic;
		font-weight: ${props.theme.fontWeights.bold};
		text-transform: uppercase;
		color: ${props.theme.colors.foreground};

		/** Animation */
		position: relative;
		&:before,
		&:after {
			content: "${props.content}";
			position: absolute;
			top: 0;
			overflow: hidden;
			background: ${props.theme.colors.background};
		}

		&:before {
			left: -2px;
			text-shadow: -0.05em 0 ${props.theme.colors.tertiary};
		}

		&:after {
			left: 2px;
			text-shadow: -0.05em 0 ${props.theme.colors.primary};
		}

		${distortion(distortionArgs)}
	`
})

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<StyledAppTitle content={title}>{title}</StyledAppTitle>
	</InternalLink>
)
