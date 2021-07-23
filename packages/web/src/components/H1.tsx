import {Heading} from "@chakra-ui/react"
import React from "react"

export const H1: React.FC = ({children}) => (
	<Heading as="h1" textAlign="center" fontWeight="normal" mb="4">
		{children}
	</Heading>
)
