import bytes from "bytes"
import React, {useEffect} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {Box} from "@chakra-ui/react"
import type {BoxProps} from "@chakra-ui/react"
import {useTextObfuscate} from "../hooks"
import {DeleteIcon} from "./DeleteIcon"
import {NoisyIconButton} from "./NoisyIconButton"

const triangleHeight = "25px"
const StyledFileStick = styled(Box)(
	(props) => css`
		font-size: ${props.theme.fontSizes.md};
		color: ${props.theme.colors.foreground};
		display: flex;
		padding: ${props.theme.space["2"]} ${props.theme.space["4"]};
		background-color: ${props.theme.colors.tertiary};
		align-items: center;

		/** Top-right edge cut off */
		position: relative;
		&:after {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			border-left: ${triangleHeight} solid transparent;
			border-top: ${triangleHeight} solid ${props.theme.colors.background};
		}
	`,
)

const FileInfo = styled.p`
	text-align: left;
	margin: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-size: ${(props) => props.theme.fontSizes.sm};
`

const FileInfoTop = styled(FileInfo)`
	margin-bottom: ${(props) => props.theme.space["1"]};
	font-size: ${(props) => props.theme.fontSizes.md};
`

export const FileStick: React.VFC<
	{
		name: string
		size: number
		obfuscate?: boolean
		onDelete: () => void
	} & BoxProps
> = ({name, size, obfuscate = false, onDelete, ...boxProps}) => {
	const [obfuscatedName, obfuscateName] = useTextObfuscate(name, 100)
	const [obfuscatedSize, obfuscateSize] = useTextObfuscate(bytes(size), 100)

	useEffect(() => {
		if (obfuscate) {
			obfuscateName()
			obfuscateSize()
		}
	}, [obfuscate, obfuscateName, obfuscateSize])

	return (
		<StyledFileStick {...boxProps}>
			<NoisyIconButton onClick={onDelete} padding="0" marginRight="2">
				<DeleteIcon />
			</NoisyIconButton>

			<div>
				<FileInfoTop title={name}>{obfuscatedName}</FileInfoTop>
				<FileInfo>{obfuscatedSize}</FileInfo>
			</div>
		</StyledFileStick>
	)
}
