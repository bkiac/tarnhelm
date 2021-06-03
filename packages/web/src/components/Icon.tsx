import styled from "@emotion/styled"
import type {ThemeIconContentCodes} from "@emotion/react"
import {iconFont} from "../styles/mixins"

export const Icon = styled.i<{
	glyph: keyof ThemeIconContentCodes
}>`
	${iconFont}

	&:before {
		content: ${(props) => `'${props.theme.iconContentCodes[props.glyph]}'`};
	}
`
