import bytes from "bytes"
import React, {useEffect} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {useTextObfuscate} from "../hooks"
import {noise} from "../styles/animations"
import {DeleteIcon} from "./DeleteIcon"
import {IconButton} from "./IconButton"

const noiseArgs = {
	steps: 66,
	fraction: 2,
	duration: 3,
}

const StyledFileStick = styled.div((props) => {
	const triangleHeight = "25px"
	return css`
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
	`
})

const StyledIconButton = styled(IconButton)((props) => {
	const fontSize = props.theme.fontSizes["4xl"]
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
			content: "${props.theme.iconContentCodes.delete}";
			position: absolute;
			top: 0;
			left: 0;
			overflow: hidden;
			background: ${props.theme.colors.tertiary};
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

export const FileStick: React.VFC<{
	name: string
	size: number
	className?: string
	obfuscate?: boolean
	onDelete: () => void
}> = ({className, name, size, obfuscate = false, onDelete}) => {
	const [obfuscatedName, obfuscateName] = useTextObfuscate(name, 100)
	const [obfuscatedSize, obfuscateSize] = useTextObfuscate(bytes(size), 100)

	useEffect(() => {
		if (obfuscate) {
			obfuscateName()
			obfuscateSize()
		}
	}, [obfuscate, obfuscateName, obfuscateSize])

	return (
		<StyledFileStick className={className}>
			<StyledIconButton onClick={onDelete}>
				<DeleteIcon />
			</StyledIconButton>

			<div>
				<FileInfoTop title={name}>{obfuscatedName}</FileInfoTop>
				<FileInfo>{obfuscatedSize}</FileInfo>
			</div>
		</StyledFileStick>
	)
}
