import {VStack} from "@chakra-ui/react"
import React from "react"
import {BrandText, DistortedText, InternalLink, Page} from "../components"

const NotFoundPage: React.FC = () => (
	<Page>
		<VStack spacing="4">
			<BrandText fontSize="9xl">404</BrandText>
			<DistortedText>something went wrong</DistortedText>
			<InternalLink href="/">go to upload</InternalLink>
		</VStack>
	</Page>
)

export default NotFoundPage
