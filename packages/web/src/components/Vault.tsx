import React from "react"
import styled from "@emotion/styled"
import {Text} from "@chakra-ui/react"
import {css} from "@emotion/react"
import {DeathIcon} from "./DeathIcon"
import {FileStick} from "./FileStick"
import {SaveIcon} from "./SaveIcon"

const StyledVault = styled.div<{
	center: boolean
	hasError: boolean
}>(
	(props) => css`
		border: 1px solid
			${props.hasError ? props.theme.colors.error : props.theme.colors.primary};
		padding: ${props.theme.space["8"]};
		color: ${props.hasError
			? props.theme.colors.error
			: props.theme.colors.secondary};
		overflow-x: hidden;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		${props.center &&
		css`
			cursor: pointer;
			justify-content: center;
		`}
	`,
)

type FileObject = {
	id: string
	name: string
	size: number
	onDelete: () => void
}

function renderPartial(
	node: React.ReactNode,
	message: React.ReactNode,
	hasError: boolean,
): React.ReactElement {
	return (
		<>
			{node}
			<Text color={hasError ? "error" : "foreground"}>{message}</Text>
		</>
	)
}

export const Vault: React.FC<{
	files?: FileObject[]
	isDragActive?: boolean
	hasError?: boolean
}> = ({files = [], isDragActive = false, hasError = false}) => {
	const isEmpty = files.length === 0

	return (
		<StyledVault center={isEmpty} hasError={hasError}>
			{hasError ? (
				renderPartial(<DeathIcon />, "Unexpected Error", hasError)
			) : (
				<>
					{isEmpty ? (
						<>
							{isDragActive
								? renderPartial(<SaveIcon />, "Drop files to start", hasError)
								: renderPartial(
										<SaveIcon />,
										"Click or drop files to start",
										hasError,
								  )}
						</>
					) : (
						files.map(({id, ...f}) => (
							<FileStick
								key={id}
								mb={files.length > 1 ? "4" : undefined}
								{...f}
							/>
						))
					)}
				</>
			)}
		</StyledVault>
	)
}
