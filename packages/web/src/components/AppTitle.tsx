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

		/** Animation */
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
		}

		&:after {
			left: 2px;
			text-shadow: -0.05em 0 ${props.theme.palette.primary};
		}

		${distortion(distortionArgs)}
	`,
)

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<StyledAppTitle content={title}>{title}</StyledAppTitle>
	</InternalLink>
)
