import React from "react"
import styled from "styled-components"
import { AppTitle } from "./AppTitle"
import { ExternalLink } from "./ExternalLink"
import { InternalLink } from "./InternalLink"
import { TippinButton } from "./TippinButton"

const Container = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	@media screen and (max-width: 768px) {
		flex-direction: column-reverse;
		justify-content: space-evenly;
		align-content: center;
	}
`

const Item = styled.div`
	@media screen and (max-width: 768px) {
		margin: 0.5rem 0;
	}
`

export const Footer: React.FunctionComponent = () => (
	<Container>
		<Item>
			<AppTitle />
		</Item>

		<Item>
			<InternalLink href="/thanks">Thanks</InternalLink>
		</Item>

		<Item>
			<ExternalLink href="https://github.com/bkiac/tarnhelm" target="_blank">
				Code
			</ExternalLink>
		</Item>

		<Item>
			<ExternalLink
				href="https://1ml.com/node/0254aece594745b70a0ee6729c649eef57c0b5020be8cab2f4d46ff175d9333200"
				target="_blank"
			>
				Node
			</ExternalLink>
		</Item>

		<Item>
			<TippinButton />
		</Item>
	</Container>
)
