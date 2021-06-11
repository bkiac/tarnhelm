import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {twitch, createNoise} from "../styles/keyframes"
import {A} from "./A"
import {InternalLink} from "./InternalLink"

const noise = createNoise(30, 2)

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
		animation: ${twitch} 5s 5s infinite;

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
			animation: ${noise} 8s linear infinite alternate-reverse,
				${twitch} 5s 5s infinite;
		}
		&:after {
			left: 2px;
			text-shadow: -0.05em 0 ${props.theme.palette.primary};
			animation: ${noise} 8s linear infinite alternate-reverse,
				${twitch} 5s 5.05s infinite;
		}
	`,
)

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<StyledAppTitle content={title}>{title}</StyledAppTitle>
	</InternalLink>
)
