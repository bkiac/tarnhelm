import React from "react"
import {Global, css} from "@emotion/react"

export const GlobalStyle: React.VFC = () => (
	<Global
		styles={css`
			html,
			body,
			#root {
				height: 100%;
				margin: 0;
			}
		`}
	/>
)
