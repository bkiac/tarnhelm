import styled from "styled-components"
import type {DefaultTheme} from "styled-components"
import {iconFont} from "../styles/mixins"

export const Icon = styled.i<{
	glyph: keyof DefaultTheme["iconContentCodes"]
}>`
	${iconFont}

	&:before {
		content: ${(props) => `'${props.theme.iconContentCodes[props.glyph]}'`};
	}
`
