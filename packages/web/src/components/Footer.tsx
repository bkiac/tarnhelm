import React from "react"
import {Box, Center, Flex, HStack, useBreakpointValue} from "@chakra-ui/react"
import type {BoxProps} from "@chakra-ui/react"
import {AppTitle} from "./AppTitle"
import {ExternalLink} from "./ExternalLink"
import {InternalLink} from "./InternalLink"

export const Footer: React.VFC<BoxProps> = (boxProps) => {
	const showAppTitleRow = useBreakpointValue({base: true, md: false}) ?? true
	const showAppTitleItem = !showAppTitleRow
	return (
		<Box as="footer" {...boxProps}>
			<Flex align="center" justify={{base: "initial", md: "space-between"}}>
				{showAppTitleItem && <AppTitle />}
				<HStack
					w={{base: "100%", md: "initial"}}
					spacing={{base: "initial", md: "10"}}
					justifyContent={{base: "space-between", sm: "space-around"}}
				>
					<InternalLink href="/thanks">Thanks</InternalLink>
					<ExternalLink
						href="https://github.com/bkiac/tarnhelm"
						target="_blank"
					>
						Code
					</ExternalLink>
					<ExternalLink
						href="https://1ml.com/node/0254aece594745b70a0ee6729c649eef57c0b5020be8cab2f4d46ff175d9333200"
						target="_blank"
					>
						Node
					</ExternalLink>
				</HStack>
			</Flex>
			{showAppTitleRow && (
				<Center mt="2">
					<AppTitle />
				</Center>
			)}
		</Box>
	)
}
