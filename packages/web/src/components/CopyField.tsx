import React, {useCallback} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {Box, Flex} from "@chakra-ui/react"
import {CopyIcon} from "@chakra-ui/icons"
import {IconButton} from "./IconButton"
import {noise, noiseSnippet} from "../styles/animations"

const noiseArgs = {
	steps: 66,
	fraction: 2,
	duration: 10,
}

const iconSpacing = 2

const Icon = styled(CopyIcon)`
	vertical-align: initial;
`

const IconBeforeAfter = styled(Icon)`
	position: absolute;
	top: ${(props) => props.theme.space[iconSpacing]};
	right: ${(props) => props.theme.space[iconSpacing]};
	overflow: hidden;

	&:hover {
		${noise(noiseArgs)};
	}
`

const IconBefore = styled(IconBeforeAfter)((props) => {
	const [k, p] = noiseSnippet(noiseArgs)
	return css`
		&:hover {
			filter: drop-shadow(0.05em 0.025em 0 ${props.theme.colors.primary});
			animation: ${k} ${p};
		}
	`
})

const IconAfter = styled(IconBeforeAfter)((props) => {
	const [k, p] = noiseSnippet(noiseArgs)
	return css`
		&:hover {
			right: calc(${props.theme.space[iconSpacing]} - 1px);
			filter: drop-shadow(0.025em 0.05em 0 ${props.theme.colors.secondary});
			animation: ${k} ${p};
		}
	`
})

const StyledIconButton = styled(IconButton)`
	line-height: 100%; // line-height must equal font-size; if line-height is larger than font-size the noise animation may not be fully visible because noise animation inset is in em
	color: ${(props) => props.theme.colors.foreground};
	background-color: ${(props) => props.theme.colors.tertiary};
	padding: ${(props) => props.theme.space[iconSpacing]};

	&:hover {
		cursor: pointer;
	}

	/** Animation */
	position: relative;
`

export const CopyField: React.VFC<{value: string}> = ({value}) => {
	const handleClick = useCallback(() => {
		void navigator.clipboard.writeText(value)
	}, [value])
	return (
		<Flex align="center" border="1px" borderColor="white">
			<Box overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" px="1">
				{value}
			</Box>
			<StyledIconButton onClick={handleClick}>
				<IconBefore />
				<Icon />
				<IconAfter />
			</StyledIconButton>
		</Flex>
	)
}
