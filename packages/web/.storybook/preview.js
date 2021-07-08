import React from "react"
import {ChakraProvider} from "@chakra-ui/react"
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
		<ChakraProvider theme={theme}>
			<GlobalStyle />
			<Story />
		</ChakraProvider>
	),
]
