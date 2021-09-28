import React, {useCallback} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {Box, Flex, Center} from "@chakra-ui/react"
import {CopyIcon} from "@chakra-ui/icons"
import {IconButton} from "./IconButton"
import {noise, noiseSnippet} from "../styles/animations"

const noiseArgs = {
	steps: 66,
	fraction: 2,
	duration: 3,
}

const Icon = styled(CopyIcon)`
	vertical-align: initial;
`

const IconBeforeAfter = styled(Icon)`
	position: absolute;
	top: 0;
	left: 0;
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
			left: 1px;
			filter: drop-shadow(0.025em 0.05em 0 ${props.theme.colors.secondary});
			animation: ${k} ${p};
		}
	`
})

const StyledIconButton = styled(IconButton)(
	(props) => css`
		line-height: 100%; // line-height must equal font-size; if line-height is larger than font-size the noise animation may not be fully visible because noise animation inset is in em
		color: ${props.theme.colors.foreground};

		&:hover {
			cursor: pointer;
		}

		/** Animation */
		position: relative;
	`,
)

const B = styled(Flex)``

const B1 = styled(Box)`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`

const B2 = styled(Box)`
	/* border-width: 1px 1px 1px 0; */
`

export const CopyField: React.VFC<{value: string}> = ({value}) => {
	const handleClick = useCallback(() => {
		void navigator.clipboard.writeText(value)
	}, [value])
	return (
		<B align="center" border="1px" borderColor="white">
			<B1>{value}</B1>
			<B2 bg="tertiary">
				<Center>
					<StyledIconButton onClick={handleClick}>
						<IconBefore />
						<Icon />
						<IconAfter />
					</StyledIconButton>
				</Center>
			</B2>
		</B>
	)
}
