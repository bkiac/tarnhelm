import {Heading} from "@chakra-ui/react"
import React from "react"

export const H1: React.VFC<{children: React.ReactText}> = ({children}) => (
	<Heading as="h1" textAlign="center" fontWeight="normal">
		{children}
	</Heading>
)
