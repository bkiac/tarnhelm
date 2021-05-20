import styled from "styled-components"
import type {DefaultThemeIconContentCodes} from "styled-components"
import {iconFont} from "../styles/mixins"

export const Icon = styled.i<{
	glyph: keyof DefaultThemeIconContentCodes
}>`
	${iconFont}

	&:before {
		content: ${(props) => `'${props.theme.iconContentCodes[props.glyph]}'`};
	}
`
