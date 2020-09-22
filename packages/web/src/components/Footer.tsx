import React from "react"
import styled from "styled-components"
import AppTitle from "./AppTitle"
import ExternalLink from "./ExternalLink"
import InternalLink from "./InternalLink"

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

const Footer: React.FunctionComponent = () => {
	return (
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
				<p>Tips: bc1qe95pnse2q0yp7jwzu4pdjv7xz3gamzucum5nyh</p>
			</Item>
		</Container>
	)
}

export default Footer
