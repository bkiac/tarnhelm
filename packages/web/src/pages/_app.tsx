import React from "react"
import {ChakraProvider} from "@chakra-ui/react"
import type {AppProps} from "next/app"
import {GlobalStyle} from "../components/GlobalStyle"
import "../lib/axios" // Set up axios
import "../styles/index.css"
import {theme} from "../styles/theme"

export default function App({Component, pageProps}: AppProps): JSX.Element {
	return (
		<ChakraProvider theme={theme}>
			<GlobalStyle />
			<Component {...pageProps} />
		</ChakraProvider>
	)
}
