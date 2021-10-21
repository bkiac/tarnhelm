import React, {useCallback} from "react"
import {Box, Flex} from "@chakra-ui/react"
import {CopyIcon} from "@chakra-ui/icons"
import type {FlexProps} from "@chakra-ui/react"
import {NoisyIconButton} from "./NoisyIconButton"

export const CopyField: React.VFC<{value: string} & FlexProps> = ({
	value,
	...flexProps
}) => {
	const handleClick = useCallback(() => {
		void navigator.clipboard.writeText(value)
	}, [value])
	return (
		<Flex align="center" border="1px" borderColor="white" {...flexProps}>
			<Box overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" px="1">
				{value}
			</Box>
			<NoisyIconButton onClick={handleClick}>
				<CopyIcon width={5} height={5} />
			</NoisyIconButton>
		</Flex>
	)
}
