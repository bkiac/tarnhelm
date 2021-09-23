import React from "react"
import styled from "@emotion/styled"
import {AppTitle} from "./AppTitle"
import {ExternalLink} from "./ExternalLink"
import {InternalLink} from "./InternalLink"

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
				href="https://1ml.com/node/0251a49d75afe6f004364120951aba3912f6d9d4c241f7e857462f58a73729deb1"
				target="_blank"
			>
				Node
			</ExternalLink>
		</Item>
	</Container>
)
