import React, {useState} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {Box} from "@chakra-ui/react"
import {IconButton} from "./IconButton"
import type {NoiseArgs} from "../styles/animations"
import {noiseSnippet} from "../styles/animations"

const DEFAULT_NOISE_ARGS = {
	steps: 66,
	fraction: 2,
	duration: 10,
}

type AnimationHelperProps = {
	hover?: boolean
	noiseArgs?: NoiseArgs
}

const AnimationHelper = styled.span`
	position: absolute;
	right: 0;
	overflow: hidden;
`

const AnimationHelperBefore = styled(AnimationHelper)<AnimationHelperProps>(
	({noiseArgs = DEFAULT_NOISE_ARGS, hover = false, theme}) => {
		const [k, p] = noiseSnippet(noiseArgs)
		if (!hover) {
			return css``
		}
		return css`
			filter: drop-shadow(0.05em 0.025em 0 ${theme.colors.primary});
			animation: ${k} ${p};
		`
	},
)

const AnimationHelperAfter = styled(AnimationHelper)<AnimationHelperProps>(
	({noiseArgs = DEFAULT_NOISE_ARGS, hover = false, theme}) => {
		const [k, p] = noiseSnippet(noiseArgs)
		if (!hover) {
			return css``
		}
		return css`
			right: -1px;
			filter: drop-shadow(0.025em 0.05em 0 ${theme.colors.secondary});
			animation: ${k} ${p};
		`
	},
)

export const NoisyIconButton: React.VFC<
	React.ComponentProps<typeof IconButton>
> = ({children, ...props}) => {
	const [hover, setHover] = useState(false)
	return (
		<IconButton
			padding="1.5"
			{...props}
			lineHeight="100%" // Must equal font-size; if line-height is larger than font-size the noise animation may not be fully visible because noise animation inset is in em
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<Box
				as="span"
				position="relative" // Enables animation helper positioning
			>
				<AnimationHelperBefore hover={hover}>{children}</AnimationHelperBefore>
				<span>{children}</span>
				<AnimationHelperAfter hover={hover}>{children}</AnimationHelperAfter>
			</Box>
		</IconButton>
	)
}
