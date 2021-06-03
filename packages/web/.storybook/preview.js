import React from "react"
import {ThemeProvider} from "@emotion/react"
import {GlobalStyle} from "../src/components/GlobalStyle"
import {theme} from "../src/styles/theme"
import "../src/styles/index.css"

export const parameters = {
	actions: {argTypesRegex: "^on[A-Z].*"},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

export const decorators = [
	(Story) => (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<Story />
		</ThemeProvider>
	),
]
