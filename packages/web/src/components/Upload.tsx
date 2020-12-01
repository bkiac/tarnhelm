import bytes from "bytes"
import differenceWith from "lodash.differencewith"
import React, { useCallback, useMemo, useState } from "react"
import type { DropHandler } from "react-dropzone"
import { useDropzone } from "react-dropzone"
import styled, { css } from "styled-components"
import { v4 as uuid } from "uuid"
import { useUpload } from "../hooks"
import { UseUploadStatus } from "../hooks/useUpload"
import Button from "./Button"
import DangerIcon from "./DangerIcon"
import InternalLink from "./InternalLink"
import Select from "./Select"
import Vault from "./Vault"

const Container = styled.div`
	width: 30vw;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Dropzone = styled.div`
	width: 100%;
	margin-bottom: 1rem;
`

const Info = styled.div`
	width: 95%;
	margin-bottom: 1rem;
`

const InfoRow = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 1rem;

	& > p {
		margin: 0;
	}
`

const StyledTotalSize = styled.p<{ hasError?: boolean }>(
	(props) => css`
		color: ${props.hasError ?? false
			? props.theme.palette.error
			: props.theme.palette.foreground};
	`,
)

function isDuplicate<A extends File, B extends File>(a: A, b: B): boolean {
	return (
		a.name === b.name &&
		a.size === b.size &&
		a.type === b.type &&
		a.lastModified === b.lastModified
	)
}

interface FileObject {
	id: string
	file: File
}

const TotalSize: React.FC<{ hasError?: boolean }> = ({
	hasError,
	children,
}) => (
	<StyledTotalSize hasError={hasError}>
		{(hasError ?? false) && <DangerIcon />}
		{children}
	</StyledTotalSize>
)

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024

const ONE_MINUTE = 60
const ONE_HOUR = 60 * ONE_MINUTE
const ONE_DAY = 24 * ONE_HOUR
const ONE_WEEK = 7 * ONE_DAY
const EXPIRY_OPTIONS = [
	{
		value: 5 * ONE_MINUTE,
		label: "5 minutes",
	},
	{
		value: ONE_HOUR,
		label: "1 hour",
	},
	{
		value: ONE_DAY,
		label: "1 day",
	},
	{
		value: ONE_WEEK,
		label: "1 week",
	},
	{
		value: 2 * ONE_WEEK,
		label: "2 weeks",
	},
]

const DOWNLOAD_LIMIT_OPTIONS = [
	{
		value: 1,
	},
	{
		value: 2,
	},
	{
		value: 3,
	},
	{
		value: 5,
	},
	{
		value: 20,
	},
	{
		value: 100,
	},
	{
		value: 200,
	},
]

const Upload: React.FC = () => {
	const [fileObjects, setFileObjects] = useState<FileObject[]>([])
	const files = useMemo(() => fileObjects.map((fo) => fo.file), [fileObjects])
	const totalSize = useMemo(
		() => files.reduce((size, file) => size + file.size, 0),
		[files],
	)
	const hasFiles = files.length > 0
	const areFilesTooLarge = totalSize > MAX_FILE_SIZE

	const addFiles = useCallback((newFiles: File[]) => {
		setFileObjects((oldFileObjects) => [
			...oldFileObjects,
			...newFiles.map((f) => ({ id: uuid(), file: f })),
		])
	}, [])
	const deleteFile = useCallback((id: string) => {
		setFileObjects((oldFileObjects) =>
			oldFileObjects.filter((fo) => fo.id !== id),
		)
	}, [])

	const createFileDeleteHandler = useCallback(
		(id: string) => () => deleteFile(id),
		[deleteFile],
	)

	const filesInVault = useMemo(
		() =>
			fileObjects.map((fo) => ({
				id: fo.id,
				name: fo.file.name,
				size: fo.file.size,
				onDelete: createFileDeleteHandler(fo.id),
			})),
		[fileObjects, createFileDeleteHandler],
	)

	const [expiry, setExpiry] = useState(EXPIRY_OPTIONS[0].value)
	const [downloadLimit, setDownloadLimit] = useState(
		DOWNLOAD_LIMIT_OPTIONS[0].value,
	)

	const [state, upload] = useUpload()
	const {
		secretb64,
		id,
		status,
		invoice,
		progress: { loading, percent },
	} = state

	const handleDrop = useCallback<DropHandler>(
		(newFiles) => addFiles(differenceWith(newFiles, files, isDuplicate)),
		[files, addFiles],
	)
	const dropzone = useDropzone({
		onDrop: handleDrop,
		noClick: hasFiles,
		noKeyboard: hasFiles,
		disabled: areFilesTooLarge,
		multiple: false,
	})

	const handleClick = useCallback(() => {
		if (!loading && hasFiles) {
			upload(files[0], { expiry, downloadLimit })
		}
	}, [files, hasFiles, loading, upload, expiry, downloadLimit])

	const to =
		id != null && secretb64 != null
			? `/download?id=${id}&secretb64=${secretb64}`
			: ""

	const awaitingPayment = status === UseUploadStatus.AwaitingPayment
	const uploading = status !== UseUploadStatus.Ready && loading
	const success = !loading && id != null && secretb64 != null

	const uploadDisabled = useMemo(
		() =>
			!hasFiles ||
			areFilesTooLarge ||
			loading ||
			expiry < 1 ||
			expiry > 2 * ONE_WEEK ||
			downloadLimit < 1 ||
			downloadLimit > 200,
		[hasFiles, areFilesTooLarge, loading, expiry, downloadLimit],
	)

	return (
		<Container>
			<Dropzone {...dropzone.getRootProps()}>
				<Vault
					files={filesInVault}
					isDragActive={dropzone.isDragActive}
					awaitingPayment={awaitingPayment}
					invoice={invoice}
					loading={loading}
					success={success}
				/>
				<input {...dropzone.getInputProps()} />
			</Dropzone>

			<Info>
				<InfoRow>
					<p>Total Size</p>
					<TotalSize hasError={areFilesTooLarge}>{bytes(totalSize)}</TotalSize>
				</InfoRow>

				<InfoRow>
					<p>Expires After</p>
					{uploading || success ? (
						<p>
							{EXPIRY_OPTIONS.find((option) => option.value === expiry)?.label}
						</p>
					) : (
						<Select
							value={expiry}
							options={EXPIRY_OPTIONS}
							onChange={(value) => setExpiry(value)}
						/>
					)}
				</InfoRow>

				<InfoRow>
					<p>Download Limit</p>
					{uploading || success ? (
						<p>{downloadLimit}</p>
					) : (
						<Select
							value={downloadLimit}
							options={DOWNLOAD_LIMIT_OPTIONS}
							onChange={(value) => setDownloadLimit(value)}
						/>
					)}
				</InfoRow>

				{uploading && (
					<>
						<InfoRow>
							<p>Progress</p>
							<p>{Math.floor(percent * 100)}%</p>
						</InfoRow>
					</>
				)}
			</Info>

			{hasFiles && !loading && !success && (
				<Button onClick={handleClick} disabled={uploadDisabled}>
					Upload
				</Button>
			)}

			{success && <InternalLink href={to}>{to}</InternalLink>}
		</Container>
	)
}

export default Upload
