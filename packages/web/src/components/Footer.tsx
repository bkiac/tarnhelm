import React from "react"
import {Box, Flex, HStack} from "@chakra-ui/react"
import type {BoxProps} from "@chakra-ui/react"
import {AppTitle} from "./AppTitle"
import {ExternalLink} from "./ExternalLink"
// import {InternalLink} from "./InternalLink"

export const Footer: React.VFC<BoxProps> = (boxProps) => (
	<Box as="footer" {...boxProps}>
		<Flex
			align="center"
			justify={{base: "initial", md: "space-between"}}
			direction={{base: "column-reverse", md: "row"}}
		>
			<Box mt={{base: "2", md: "initial"}}>
				<AppTitle />
			</Box>
			<HStack
				w={{base: "100%", md: "initial"}}
				spacing={{base: "initial", md: "10"}}
				justifyContent={{base: "space-between", sm: "space-around"}}
			>
				{/* <InternalLink href="/thanks">Thanks</InternalLink> */}
				<ExternalLink href="https://github.com/bkiac/tarnhelm" target="_blank">
					Code
				</ExternalLink>
				<ExternalLink
					href="https://1ml.com/node/0251a49d75afe6f004364120951aba3912f6d9d4c241f7e857462f58a73729deb1"
					target="_blank"
				>
					Node
				</ExternalLink>
			</HStack>
		</Flex>
	</Box>
)
