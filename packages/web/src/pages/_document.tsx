import React from "react"
import Document, {Html, Head, Main, NextScript} from "next/document"

class MyDocument extends Document {
	render(): JSX.Element {
		return (
			<Html>
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Abel&family=Paytone+One&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
