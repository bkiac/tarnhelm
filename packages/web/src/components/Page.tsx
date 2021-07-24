import React from "react"
import {Box, Container, Flex} from "@chakra-ui/react"
import {Footer} from "./Footer"
import {H1} from "./H1"

export const Page: React.VFC<{
	title: React.ReactText
	children: React.ReactNode
}> = ({title, children}) => (
	<Flex direction="column" justify="space-between" h="100%" p="2">
		<Box as="header" mb="4">
			<H1>{title}</H1>
		</Box>

		<Container as="main" maxW="container.md" centerContent>
			{children}
		</Container>

		<Footer mt="4" />
	</Flex>
)
