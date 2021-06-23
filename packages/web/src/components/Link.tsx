import styled, {css} from "styled-components"
import {glitch} from "../styles/animations"

const glitchWidth = "1px"
const glitchProperties = {
	duration: 0.3,
}

export const Link = styled.a(
	(props) => css`
		color: ${props.theme.palette.foreground};
		text-decoration: none;
		padding: 0 0.5rem 0.25rem;
		border-bottom: ${glitchWidth} solid ${props.theme.palette.foreground};
		position: relative;

		&:visited {
			color: ${props.theme.palette.foreground};
		}

		&:before,
		&:after {
			content: "";
			position: absolute;
			bottom: -${glitchWidth};
			left: 0;
			right: 0;
			height: ${glitchWidth};
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
				animation: ${glitch(glitchWidth, glitchProperties)};
			}

			&:after {
				animation: ${glitch(glitchWidth, {
					...glitchProperties,
					direction: "reverse",
				})};
			}
		}
	`,
)
