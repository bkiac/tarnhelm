import React from "react"
import {Global, css} from "@emotion/react"

export const GlobalStyle: React.VFC = () => (
	<Global
		styles={css`
			html,
			body,
			#__next {
				height: 100%;
			}
		`}
	/>
)
