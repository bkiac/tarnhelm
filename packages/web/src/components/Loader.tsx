import React from "react"
import {css, keyframes} from "@emotion/react"
import styled from "@emotion/styled"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledLoader = styled.div(
	(props) => css`
		width: 68px;
		height: 68px;
		border: 2px solid ${props.theme.colors.secondary};
		position: relative;
		animation: ${rotate} 2.6s linear infinite;

		&:before,
		&:after {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			animation: ${rotate} 1.3s linear infinite;
			animation-direction: reverse;
		}

		&:before {
			border: 2px solid ${props.theme.colors.primary};
			width: 48px;
			height: 48px;
			margin: -26px 0 0 -26px;
		}

		&:after {
			border: 2px solid ${props.theme.colors.tertiary};
			width: 96px;
			height: 96px;
			margin: -50px 0 0 -50px;
		}
	`,
)

export const Loader: React.FC = () => <StyledLoader />
