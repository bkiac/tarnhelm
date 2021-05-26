import bytes from "bytes"
import differenceWith from "lodash/differenceWith"
import QRCode from "qrcode.react"
import React, {useCallback, useMemo, useState} from "react"
import {useDropzone} from "react-dropzone"
import styled, {css} from "styled-components"
import {v4 as uuid} from "uuid"
import type {DropHandler} from "react-dropzone"
import {useUpload} from "../hooks"
import {UseUploadStatus} from "../hooks/useUpload"
import {Button} from "./Button"
import {DangerIcon} from "./DangerIcon"
import {Loader} from "./Loader"
import {Select} from "./Select"
import {Vault} from "./Vault"
import {
	downloadLimitOptions,
	expiryOptions,
	MAX_FILE_SIZE,
	ONE_WEEK,
} from "../utils"

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

const StyledTotalSize = styled.p<{hasError?: boolean}>(
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

type FileObject = {
	id: string
	file: File
}

const TotalSize: React.FC<{hasError?: boolean}> = ({hasError, children}) => (
	<StyledTotalSize hasError={hasError}>
		{(hasError ?? false) && <DangerIcon />}
		{children}
	</StyledTotalSize>
)

export const Upload: React.FC = () => {
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
			...newFiles.map((f) => ({id: uuid(), file: f})),
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

	const [expiry, setExpiry] = useState(expiryOptions[0].value)
	const [downloadLimit, setDownloadLimit] = useState(
		downloadLimitOptions[0].value,
	)

	const [state, upload] = useUpload()
	const {
		secretb64,
		id,
		status,
		invoice,
		progress: {loading, percent},
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
			upload(files[0], {expiry, downloadLimit})
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
			{awaitingPayment && invoice != null ? (
				<>
					<QRCode value={invoice} size={256} />
					<p style={{width: 300, wordWrap: "break-word"}}>{invoice}</p>
				</>
			) : (
				<>
					{loading ? (
						<>
							<Loader />
							<p>{Math.floor(percent * 100)}%</p>
						</>
					) : (
						<>
							{success ? (
								<p>{window.location.hostname + to}</p>
							) : (
								<Dropzone {...dropzone.getRootProps()}>
									<Vault
										files={filesInVault}
										isDragActive={dropzone.isDragActive}
										loading={loading}
										success={success}
									/>
									<input {...dropzone.getInputProps()} />
								</Dropzone>
							)}
						</>
					)}
				</>
			)}

			<Info>
				<InfoRow>
					<p>Total Size</p>
					<TotalSize hasError={areFilesTooLarge}>{bytes(totalSize)}</TotalSize>
				</InfoRow>

				<InfoRow>
					<p>Expires After</p>
					{uploading || success ? (
						<p>
							{expiryOptions.find((option) => option.value === expiry)?.label}
						</p>
					) : (
						<Select
							value={expiry}
							options={expiryOptions}
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
							options={downloadLimitOptions}
							onChange={(value) => setDownloadLimit(value)}
						/>
					)}
				</InfoRow>

				{hasFiles && (
					<InfoRow>
						<p>Price</p>
						<p>${totalSize * 2e-10}</p>
					</InfoRow>
				)}
			</Info>

			{hasFiles && !loading && !success && (
				<Button onClick={handleClick} disabled={uploadDisabled}>
					Pay & Upload
				</Button>
			)}
		</Container>
	)
}
