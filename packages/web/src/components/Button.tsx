import React from "react"
import styled, { css } from "styled-components"
import { glitch } from "../styles/animations"

const glitchSize = 0.06
const glitchOptions = {
	size: glitchSize,
	duration: 0.3,
}

const StyledButton = styled.button<{
	content: string
}>((props) => {
	const [paddingTopBottom, paddingLeftRight] = ["8px", "16px"]
	return css`
		font-size: 1.5rem;
		font-family: "Roboto Condensed", sans-serif;
		font-style: italic;
		font-weight: 700;
		text-transform: uppercase;
		color: ${props.theme.palette.background};
		border: none;
		background-color: ${props.theme.palette.primary};
		position: relative;
		cursor: pointer;

		padding: ${paddingTopBottom} ${paddingLeftRight};

		&:disabled {
			color: ${props.theme.palette.error};
			border: 1px solid ${props.theme.palette.error};
			background-color: ${props.theme.palette.background};
		}

		${!props.disabled &&
		css`
			span:first-child {
				position: relative;
				left: 0;
				top: 0;
				text-shadow: ${glitchSize}em ${glitchSize}em
					${props.theme.palette.secondary};
				color: inherit;
				z-index: 3;
			}

			span:nth-child(2) {
				position: absolute;
				top: ${paddingTopBottom};
				left: ${paddingLeftRight};

				&:before,
				&:after {
					content: "${props.content}";
					position: absolute;
					top: 0;
				}

				&:before {
					color: ${props.theme.palette.secondary};
					z-index: 1;
				}

				&:after {
					left: 0;
					color: ${props.theme.palette.tertiary};
					z-index: 2;
				}
			}

			&:hover,
			&:focus {
				span:first-child {
					text-shadow: none;
				}

				span:nth-child(2) {
					&:before {
						animation: ${glitch(glitchOptions)};
					}
					&:after {
						animation: ${glitch({ ...glitchOptions, direction: "reverse" })};
					}
				}
			}

			&:focus {
				border: 1px solid ${props.theme.palette.tertiary};
			}
		`}
	`
})

interface Props {
	onClick?: (event: React.MouseEvent) => void
	disabled?: boolean
	children: string
}

// TODO: Allow only string children
const Button: React.FC<Props> = ({ children, ...rest }) => (
	<StyledButton {...rest} content={children} type="button">
		<span>{children}</span>
		<span />
	</StyledButton>
)

export default Button
