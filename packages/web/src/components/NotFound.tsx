import React from "react"
import styled, {css} from "styled-components"

const fontSize = 3

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column-reverse;
	padding: 1rem;
	height: 60vh;
`

const commonStyles = css(
	(props) => css`
		margin: 0;
		text-align: center;
		color: ${props.theme.palette.foreground};
	`,
)

const Code = styled.h2`
	${commonStyles}
	font-size: ${fontSize * 2}rem;
	font-weight: bold;
`

const ErrorMessage = styled.h1`
	${commonStyles}
	font-size: ${fontSize}rem;
`

export const NotFound: React.FC = () => (
	<Container>
		<ErrorMessage>Not Found</ErrorMessage>
		<Code>404</Code>
	</Container>
)
