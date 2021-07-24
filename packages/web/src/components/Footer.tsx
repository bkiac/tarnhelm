import React from "react"
import {Box, Center, Flex, useBreakpointValue} from "@chakra-ui/react"
import {AppTitle} from "./AppTitle"
import {ExternalLink} from "./ExternalLink"
import {InternalLink} from "./InternalLink"

export const Footer: React.FunctionComponent = () => {
	const showAppTitleRow = useBreakpointValue({base: true, lg: false}) ?? true
	const showAppTitleItem = !showAppTitleRow
	return (
		<Box as="footer">
			<Flex
				justify={{base: "space-around", lg: "space-between"}}
				align="center"
			>
				{showAppTitleItem && <AppTitle />}

				<InternalLink href="/thanks">Thanks</InternalLink>

				<ExternalLink href="https://github.com/bkiac/tarnhelm" target="_blank">
					Code
				</ExternalLink>

				<ExternalLink
					href="https://1ml.com/node/0254aece594745b70a0ee6729c649eef57c0b5020be8cab2f4d46ff175d9333200"
					target="_blank"
				>
					Node
				</ExternalLink>
			</Flex>

			{showAppTitleRow && (
				<Center>
					<AppTitle />
				</Center>
			)}
		</Box>
	)
}
