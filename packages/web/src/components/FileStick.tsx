import bytes from "bytes"
import React, {useEffect} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {useTextObfuscate} from "../hooks"
import {noise} from "../styles/animations"
import {DeleteIcon} from "./DeleteIcon"
import {IconButton} from "./IconButton"

const noiseOptions = {
	duration: 3,
	steps: 66,
	fraction: 2,
}

const StyledFileStick = styled.div((props) => {
	const height = 50
	const triangleHeight = height / 2
	return css`
		font-size: 1rem;
		color: ${props.theme.palette.foreground};
		display: flex;
		padding: 0.5rem 1rem;
		background-color: ${props.theme.palette.tertiary};
		height: ${height}px;
		position: relative;
		align-items: center;
		width: 20vw;

		&:after {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			border-left: ${triangleHeight}px solid transparent;
			border-top: ${triangleHeight}px solid ${props.theme.palette.background};
		}
	`
})

const StyledIconButton = styled(IconButton)(
	(props) =>
		css`
			font-size: 36px;
			color: ${props.theme.palette.foreground};
			margin-right: 8px;
			position: relative;

			&:before,
			&:after {
				content: "${props.theme.iconContentCodes.delete}";
				position: absolute;
				top: 0;
				left: 0;
				overflow: hidden;
				background: ${props.theme.palette.tertiary};
			}

			&:hover {
				cursor: pointer;

				&:before {
					text-shadow: 0.05em 0.025em ${props.theme.palette.secondary};
					animation: ${noise(noiseOptions)};
				}

				&:after {
					left: 1px;
					text-shadow: 0.025em 0.05em ${props.theme.palette.primary};
					animation: ${noise(noiseOptions)};
				}
			}
		`,
)

const FileInfo = styled.p`
	text-align: left;
	margin: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: 16vw;
	font-size: 0.8rem;
`

const FileInfoTop = styled(FileInfo)`
	margin-bottom: 0.25rem;
	font-size: 1rem;
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
