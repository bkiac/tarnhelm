import isNil from "lodash/isNil"
import React from "react"
import styled from "styled-components"

const Container = styled.div`
	padding: 1rem;
	height: calc(100% - 2rem);

	display: flex;
	flex-direction: column;
`

const Main = styled.main`
	width: 50%;
	align-self: center;
	height: 100%;
`

const Footer = styled.footer`
	margin-top: auto;
`

export const Layout: React.FC<{
	footer?: React.ReactNode
}> = ({ children: main, footer }) => (
	<Container>
		<Main>{main}</Main>
		{!isNil(footer) && <Footer>{footer}</Footer>}
	</Container>
)
