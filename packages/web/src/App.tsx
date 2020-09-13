import React from "react"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { Footer, Layout } from "./components"
import GlobalStyle from "./components/GlobalStyle"
import { usePing } from "./hooks"
// Set up axios
import "./lib/axios"
import Pages, { LoadingPage } from "./pages"
import "./styles/index.css"
import theme from "./styles/theme"

const App: React.FC = () => {
	const loading = usePing()
	return (
		<Router>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<Layout footer={!loading && <Footer />}>
					{loading ? <LoadingPage /> : <Pages />}
				</Layout>
			</ThemeProvider>
		</Router>
	)
}

export default App
