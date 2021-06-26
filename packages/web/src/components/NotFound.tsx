import React from "react"
import styled from "@emotion/styled"

const fontSize = 3

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column-reverse;
	padding: 1rem;
	height: 60vh;
`

const Code = styled.h2`
	margin: 0;
	text-align: center;
	color: ${(props) => props.theme.palette.foreground};
	font-size: ${fontSize * 2}rem;
	font-weight: bold;
`

const ErrorMessage = styled.h1`
	margin: 0;
	text-align: center;
	color: ${(props) => props.theme.palette.foreground};
	font-size: ${fontSize}rem;
`

export const NotFound: React.FC = () => (
	<Container>
		<ErrorMessage>Not Found</ErrorMessage>
		<Code>404</Code>
	</Container>
)
