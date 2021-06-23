import {useRouter} from "next/router"
import React from "react"
import {Download, H1, Page} from "../components"
import NotFoundPage from "./404"

const DownloadPage: React.FC = () => {
	const router = useRouter()
	const {
		query: {id, secretb64},
	} = router
	if (typeof id === "string" && typeof secretb64 === "string") {
		return (
			<Page>
				<H1>Download</H1>
				<Download id={id} secretb64={secretb64} />
			</Page>
		)
	}
	return <NotFoundPage />
}

export default DownloadPage
