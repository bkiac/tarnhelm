import styled from "@emotion/styled"
import type {Theme} from "@emotion/react"
import {iconFont} from "../styles/mixins"

export const Icon = styled.i<{
	glyph: keyof Theme["iconContentCodes"]
}>`
	${iconFont}

	&:before {
		content: ${(props) => `'${props.theme.iconContentCodes[props.glyph]}'`};
	}
`
