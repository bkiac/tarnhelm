import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {Text} from "@chakra-ui/react"
import type {ComponentProps} from "react"
import {distortion} from "../styles/animations"

const distortionArgs = {
	twitch: {
		duration: 5,
		delay: 5,
		delayDelta: 0.05,
	},
	noise: {
		steps: 30,
		fraction: 2,
		duration: 8,
	},
}

export type DistortedTextProps = ComponentProps<typeof Text> & {
	children: React.ReactText
}

const StyledDistortedText = styled(Text)<DistortedTextProps>(
	(props) => css`
		display: inline-block;
		line-height: 100%; // line-height must equal font-size; if line-height is larger than font-size the noise animation may not be fully visible because noise animation inset is in em
		white-space: nowrap;

		/** Animation */
		position: relative;
		&:before,
		&:after {
			content: "${props.children}";
			position: absolute;
			top: 0;
			overflow: hidden;
			background: ${props.theme.colors.background};
		}

		&:before {
			left: -1px;
			text-shadow: -0.05em 0 ${props.theme.colors.tertiary};
		}

		&:after {
			right: 1px;
			text-shadow: -0.05em 0 ${props.theme.colors.primary};
		}

		${distortion(distortionArgs)}
	`,
)

export const DistortedText: React.FC<DistortedTextProps> = (props) => (
	<StyledDistortedText {...props} />
)
