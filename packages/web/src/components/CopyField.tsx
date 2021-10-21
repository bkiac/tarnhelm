import React, {useCallback, useState} from "react"
import {Box, Flex} from "@chakra-ui/react"
import {CopyIcon, CheckIcon} from "@chakra-ui/icons"
import type {FlexProps} from "@chakra-ui/react"
import {NoisyIconButton} from "./NoisyIconButton"

const ICON_SIZE = {
	width: 5,
	height: 5,
}

export const CopyField: React.VFC<{value: string} & FlexProps> = ({
	value,
	...flexProps
}) => {
	const [success, setSuccess] = useState(false)
	const handleClick = useCallback(async () => {
		await navigator.clipboard.writeText(value)
		setSuccess(true)
	}, [value])
	return (
		<Flex align="center" border="1px" borderColor="white" {...flexProps}>
			<Box overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" px="1">
				{value}
			</Box>
			<NoisyIconButton
				onClick={handleClick}
				background={success ? "success" : "tertiary"}
				onMouseLeave={() => setSuccess(false)}
			>
				{success ? <CheckIcon {...ICON_SIZE} /> : <CopyIcon {...ICON_SIZE} />}
			</NoisyIconButton>
		</Flex>
	)
}
