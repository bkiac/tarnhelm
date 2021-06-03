import React from "react"
import {ThemeProvider} from "@emotion/react"
import type {AppProps} from "next/app"
import {Footer, Layout} from "../components"
import {GlobalStyle} from "../components/GlobalStyle"
// Set up axios
import "../lib/axios"
import "../styles/index.css"
import {theme} from "../styles/theme"

export default function App({Component, pageProps}: AppProps): JSX.Element {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<Layout footer={<Footer />}>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	)
}
