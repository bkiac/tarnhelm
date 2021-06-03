import React from "react"
import {Global, css} from "@emotion/react"
import {theme} from "../styles/theme"

export const GlobalStyle: React.VFC = () => (
	<Global
		styles={css`
			html,
			body,
			#root {
				height: 100%;
				margin: 0;
			}

			html {
				font-size: 16px;
				font-family: "Roboto Mono", monospace;
				color: ${theme.palette.foreground};
			}

			body {
				background-color: ${theme.palette.background};
			}
		`}
	/>
)
