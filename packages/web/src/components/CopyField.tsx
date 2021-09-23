import React from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {Box, Flex} from "@chakra-ui/react"
import {Button} from "./Button"
import {DangerIcon} from "./DangerIcon"
import {IconButton} from "./IconButton"
import {noise} from "../styles/animations"

const noiseArgs = {
	steps: 66,
	fraction: 2,
	duration: 3,
}

const StyledIconButton = styled(IconButton)((props) => {
	const fontSize = props.theme.fontSizes["2xl"]
	return css`
		font-size: ${fontSize};
		line-height: ${fontSize}; // line-height must equal font-size; if line-height is larger than font-size the noise animation may not be fully visible because noise animation inset is in em
		color: ${props.theme.colors.foreground};
		margin-right: ${props.theme.space[2]};

		&:hover {
			cursor: pointer;
		}

		/** Animation */
		position: relative;
		&:before,
		&:after {
			content: "${props.theme.iconContentCodes.danger}";
			position: absolute;
			top: 0;
			left: 0;
			overflow: hidden;
			background: ${props.theme.colors.background};
		}

		&:hover {
			&:before {
				text-shadow: 0.05em 0.025em ${props.theme.colors.secondary};
			}

			&:after {
				left: 1px;
				text-shadow: 0.025em 0.05em ${props.theme.colors.primary};
			}

			${noise(noiseArgs)};
		}
	`
})

const B = styled(Box)(
	(props) => css`
		border-width: 1px 0 1px 1px;
		border-style: solid;
		border-color: white;
		padding: ${props.theme.space["1"]};
	`,
)

const B2 = styled(Box)(
	(props) => css`
		border: 1px solid white;
		padding: ${props.theme.space["1"]};
	`,
)

export const CopyField: React.VFC = () => {
	const ye
	return (
		<div>
			<Flex align="center" mb="2">
				<B>
					lnbcrt500u1ps5ettwpp5y5zt2hr5s5gezwj7cqh59d4www4jv6phuqy22r0rde4usvq4zrzsdqqcqzpgxqyz5vqsp57ghfpfuk6pguuwwnuwes0vt37as26740mejad0u3urvrwddzcm5q9qyyssq7mekfcl0k2vzhsqmuf4c5z7mhm702ka3cagq5yj2khnk29w5lku3nknd0fg75aemydvyxhl3sm8va3x7x97g02d0skr20ej9tsyypdsqdmg4uu
				</B>
				<B2 color="broom">copy</B2>
				<p>too bland</p>
			</Flex>
			<Flex align="center" mb="2">
				<B>
					lnbcrt500u1ps5ettwpp5y5zt2hr5s5gezwj7cqh59d4www4jv6phuqy22r0rde4usvq4zrzsdqqcqzpgxqyz5vqsp57ghfpfuk6pguuwwnuwes0vt37as26740mejad0u3urvrwddzcm5q9qyyssq7mekfcl0k2vzhsqmuf4c5z7mhm702ka3cagq5yj2khnk29w5lku3nknd0fg75aemydvyxhl3sm8va3x7x97g02d0skr20ej9tsyypdsqdmg4uu
				</B>
				<Button>copy</Button>
				<p>i dont want to reuse the main button style</p>
			</Flex>
			<Flex align="center" mb="2">
				<B>
					lnbcrt500u1ps5ettwpp5y5zt2hr5s5gezwj7cqh59d4www4jv6phuqy22r0rde4usvq4zrzsdqqcqzpgxqyz5vqsp57ghfpfuk6pguuwwnuwes0vt37as26740mejad0u3urvrwddzcm5q9qyyssq7mekfcl0k2vzhsqmuf4c5z7mhm702ka3cagq5yj2khnk29w5lku3nknd0fg75aemydvyxhl3sm8va3x7x97g02d0skr20ej9tsyypdsqdmg4uu
				</B>
				<B2>
					<IconButton>
						<DangerIcon />
					</IconButton>
				</B2>
			</Flex>
			<Flex align="center" mb="2">
				<B>
					lnbcrt500u1ps5ettwpp5y5zt2hr5s5gezwj7cqh59d4www4jv6phuqy22r0rde4usvq4zrzsdqqcqzpgxqyz5vqsp57ghfpfuk6pguuwwnuwes0vt37as26740mejad0u3urvrwddzcm5q9qyyssq7mekfcl0k2vzhsqmuf4c5z7mhm702ka3cagq5yj2khnk29w5lku3nknd0fg75aemydvyxhl3sm8va3x7x97g02d0skr20ej9tsyypdsqdmg4uu
				</B>
				<B2>
					<StyledIconButton>
						<DangerIcon />
					</StyledIconButton>
				</B2>
			</Flex>
		</div>
	)
}
