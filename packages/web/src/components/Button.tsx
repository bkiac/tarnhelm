import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {createGlitch} from "../styles/keyframes"

const glitchSize = 0.06
const glitchUnit = "em"
const glitchLength = glitchSize.toString() + glitchUnit
const glitch = createGlitch(glitchSize, glitchUnit)

const paddingTopBottom = "8px"
const paddingLeftRight = "16px"

const StyledButton = styled.button<{
	content: string
}>((props) => {
	const disabled = props.disabled ?? false
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

		${!disabled &&
		css`
			span:first-child {
				position: relative;
				left: 0;
				top: 0;
				text-shadow: ${glitchLength} ${glitchLength}
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
					white-space: nowrap;
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
						animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
							normal both infinite;
					}
					&:after {
						animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
							reverse both infinite;
					}
				}
			}

			&:focus {
				border: 1px solid ${props.theme.palette.tertiary};
			}
		`}
	`
})

type Props = {
	onClick?: (event: React.MouseEvent) => void
	disabled?: boolean
	children: string
}

export const Button: React.FC<Props> = ({children, ...rest}) => (
	<StyledButton {...rest} content={children} type="button">
		<span>{children}</span>
		<span />
	</StyledButton>
)
