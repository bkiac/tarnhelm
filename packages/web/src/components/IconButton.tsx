import React from "react"
import styled from "styled-components"
import {iconFont} from "../styles/mixins"

const StyledIconButton = styled.button`
	/* Allow icon content codes to be used inside the button, useful for pseudo-elements */
	${iconFont}

	background: none;
	color: inherit;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;
`

export const IconButton: React.FC<{
	onClick?: () => void
	disabled?: true
}> = ({children, ...props}) => (
	<StyledIconButton {...props}>{children}</StyledIconButton>
)
