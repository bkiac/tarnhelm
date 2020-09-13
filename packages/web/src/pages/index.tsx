import React from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import DownloadPage from "./DownloadPage"
import LoadingPage from "./LoadingPage"
import NotFoundPage from "./NotFoundPage"
import ThanksPage from "./ThanksPage"
import UploadPage from "./UploadPage"

const Pages: React.FC = () => (
	<Switch>
		<Route exact path="/upload">
			<UploadPage />
		</Route>

		<Route exact path="/download/:id&:secretb64">
			<DownloadPage />
		</Route>

		<Route exact path="/thanks">
			<ThanksPage />
		</Route>

		<Route exact path="/404">
			<NotFoundPage />
		</Route>

		<Route exact path="/">
			<Redirect to="/upload" />
		</Route>

		<Redirect to="/404" />
	</Switch>
)

export { UploadPage, DownloadPage, NotFoundPage, ThanksPage, LoadingPage }

export default Pages
