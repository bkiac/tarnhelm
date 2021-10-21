import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {glitch} from "../styles/animations"
import {BareButton} from "./BareButton"

const glitchArgs = {
	width: "0.06em",
	duration: 0.3,
}

const StyledButton = styled(BareButton)<{
	content: string
}>((props) => {
	const disabled = props.disabled ?? false
	const paddingTopBottom = props.theme.space["1"]
	const paddingLeftRight = props.theme.space["4"]
	return css`
		font-size: ${props.theme.fontSizes["2xl"]};
		font-family: ${props.theme.fonts.brand};
		font-style: italic;
		text-transform: uppercase;
		color: ${props.theme.colors.background};
		border: none;
		background-color: ${props.theme.colors.primary};
		position: relative;
		cursor: pointer;

		padding: ${paddingTopBottom} ${paddingLeftRight};

		&:disabled {
			color: ${props.theme.colors.error};
			border: 1px solid ${props.theme.colors.error};
			background-color: ${props.theme.colors.background};
		}

		${!disabled &&
		css`
			&:focus {
				border: 1px solid ${props.theme.colors.tertiary};
			}

			span:first-child {
				position: relative;
				left: 0;
				top: 0;
				text-shadow: ${glitchArgs.width} ${glitchArgs.width}
					${props.theme.colors.secondary};
				color: inherit;
				z-index: 3;
			}

			/** Animation */
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
					color: ${props.theme.colors.secondary};
					z-index: 1;
				}

				&:after {
					left: 0;
					color: ${props.theme.colors.tertiary};
					z-index: 2;
				}
			}

			&:hover,
			&:focus {
				span:first-child {
					text-shadow: none;
				}

				span:nth-child(2) {
					${glitch(glitchArgs)}
				}
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
	<StyledButton {...rest} content={children}>
		<span>{children}</span>
		<span />
	</StyledButton>
)
