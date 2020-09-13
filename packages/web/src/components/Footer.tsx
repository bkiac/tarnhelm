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
			<Item as={AppTitle} />

			<Item as={InternalLink} to="/thanks">
				Thanks
			</Item>

			<Item
				as={ExternalLink}
				href="https://github.com/bkiac/tarnhelm"
				target="_blank"
			>
				Code
			</Item>

			<Item as="p">Tips: bc1qe95pnse2q0yp7jwzu4pdjv7xz3gamzucum5nyh</Item>
		</Container>
	)
}

export default Footer
