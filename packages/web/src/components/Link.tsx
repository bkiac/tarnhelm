import styled, {css} from "styled-components"
import {glitch} from "../styles/animations"

const borderSize = 1
const borderUnit = "px"
const borderSizeWithUnit = `${borderSize}${borderUnit}`

const glitchOptions: {size: number; unit: "px"; duration: number} = {
	size: borderSize,
	unit: borderUnit,
	duration: 0.3,
}

export const Link = styled.a(
	(props) => css`
		color: ${props.theme.palette.foreground};
		text-decoration: none;
		padding: 0 0.5rem 0.25rem;
		border-bottom: ${borderSizeWithUnit} solid ${props.theme.palette.foreground};
		position: relative;

		&:visited {
			color: ${props.theme.palette.foreground};
		}

		&:before,
		&:after {
			content: "";
			position: absolute;
			bottom: -${borderSizeWithUnit};
			left: 0;
			right: 0;
			height: ${borderSizeWithUnit};
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
				animation: ${glitch(glitchOptions)};
			}

			&:after {
				animation: ${glitch({...glitchOptions, direction: "reverse"})};
			}
		}
	`,
)
