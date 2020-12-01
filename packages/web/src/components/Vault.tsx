import React from "react"
import styled, { css } from "styled-components"
import DeathIcon from "./DeathIcon"
import FileStick from "./FileStick"
import Loader from "./Loader"
import SaveIcon from "./SaveIcon"
import SecurityIcon from "./SecurityIcon"

const StyledVault = styled.div<{
	center: boolean
	hasError: boolean
}>(
	(props) => css`
		border: 1px solid
			${props.hasError
				? props.theme.palette.error
				: props.theme.palette.primary};
		padding: 2rem 0;
		height: 30vw;
		color: ${props.hasError
			? props.theme.palette.error
			: props.theme.palette.secondary};
		font-size: 10rem;
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

const StyledFileStick = styled(FileStick)`
	margin-bottom: 1rem;
`

const Text = styled.p<{
	hasError: boolean
}>(
	(props) => css`
		font-size: 1rem;
		color: ${props.hasError
			? props.theme.palette.error
			: props.theme.palette.foreground};
	`,
)

interface FileObject {
	id: string
	name: string
	size: number
	onDelete: () => void
}

/**
 * TODO: Replace complex conditionals in render with enumerated states
 */
const Vault: React.FC<{
	files: FileObject[]
	isDragActive: boolean
	loading?: boolean
	success?: boolean
	hasError?: boolean
	invoice?: string
	awaitingPayment?: boolean
}> = ({
	files,
	isDragActive,
	invoice,
	loading = false,
	success = false,
	hasError = false,
	awaitingPayment = false,
}) => {
	const isEmpty = files.length === 0

	function renderPartial(
		node: React.ReactNode,
		message: React.ReactNode,
	): React.ReactElement {
		return (
			<>
				{node}
				<Text hasError={hasError}>{message}</Text>
			</>
		)
	}

	return (
		<StyledVault center={isEmpty || loading || success} hasError={hasError}>
			{hasError ? (
				renderPartial(<DeathIcon />, "Unexpected Error")
			) : (
				<>
					{isEmpty ? (
						<>
							{isDragActive
								? renderPartial(<SaveIcon />, "Drop files to start")
								: renderPartial(<SaveIcon />, "Click or drop files to start")}
						</>
					) : (
						<>
							{awaitingPayment ? (
								renderPartial(<></>, invoice)
							) : (
								<>
									{loading ? (
										<Loader />
									) : (
										<>
											{success
												? renderPartial(<SecurityIcon />, "Success")
												: files.map(({ id, ...f }) => (
														<StyledFileStick key={id} {...f} />
												  ))}
										</>
									)}
								</>
							)}
						</>
					)}
				</>
			)}
		</StyledVault>
	)
}

export default Vault
