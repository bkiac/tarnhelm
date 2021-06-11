import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {createGlitch} from "../styles/keyframes"

const borderSize = 1
const borderUnit = "px"
const borderWidth = borderSize.toString() + borderUnit

const glitch = createGlitch(borderSize, borderUnit)

export const Link = styled.a(
	(props) => css`
		color: ${props.theme.palette.foreground};
		text-decoration: none;
		padding: 0 0.5rem 0.25rem;
		border-bottom: ${borderWidth} solid ${props.theme.palette.foreground};
		position: relative;

		&:visited {
			color: ${props.theme.palette.foreground};
		}

		&:before,
		&:after {
			content: "";
			position: absolute;
			bottom: -${borderWidth};
			left: 0;
			right: 0;
			height: ${borderWidth};
			visibility: hidden;
		}

		&:before {
			background-color: ${props.theme.palette.secondary};
			z-index: -1;
		}
		&:after {
			background-color: ${props.theme.palette.tertiary};
			z-index: -2;
		}

		&:hover {
			&:before,
			&:after {
				visibility: visible;
			}

			&:before {
				animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) normal
					both infinite;
			}
			&:after {
				animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse
					both infinite;
			}
		}
	`,
)
