import styled, {css} from "styled-components"
import {glitch} from "../styles/animations"

const glitchArgs = {
	width: "1px",
	duration: 0.3,
}

export const Link = styled.a(
	(props) => css`
		color: ${props.theme.palette.foreground};
		text-decoration: none;
		padding: 0 0.5rem 0.25rem;
		border-bottom: ${glitchArgs.width} solid ${props.theme.palette.foreground};
		position: relative;

		&:visited {
			color: ${props.theme.palette.foreground};
		}

		/** Animation */
		&:before,
		&:after {
			content: "";
			position: absolute;
			bottom: -${glitchArgs.width};
			left: 0;
			right: 0;
			height: ${glitchArgs.width};
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

			${glitch(glitchArgs)}
		}
	`,
)
