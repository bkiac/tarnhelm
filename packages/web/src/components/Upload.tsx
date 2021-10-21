import bytes from "bytes"
import differenceWith from "lodash/differenceWith"
import QRCode from "qrcode.react"
import React, {useCallback, useMemo, useState} from "react"
import {useDropzone} from "react-dropzone"
import styled from "@emotion/styled"
import {v4 as uuid} from "uuid"
import {Flex, Text} from "@chakra-ui/react"
import type {DropHandler} from "react-dropzone"
import {useUpload} from "../hooks"
import {UseUploadStatus} from "../hooks/useUpload"
import {Button} from "./Button"
import {DangerIcon} from "./DangerIcon"
import {Loader} from "./Loader"
import {Select} from "./Select"
import {Vault} from "./Vault"
import {CopyField} from "./CopyField"
import {
	downloadLimitOptions,
	expiryOptions,
	MAX_FILE_SIZE,
	ONE_WEEK,
} from "../utils"

const Dropzone = styled.div`
	width: 100%;
	margin-bottom: ${(props) => props.theme.space["4"]};
`

const Info = styled.div`
	width: 95%;
	margin-bottom: ${(props) => props.theme.space["4"]};
`

const InfoRow: React.VFC<{children: React.ReactNode}> = ({children}) => (
	<Flex justify="space-between" mb="4">
		{children}
	</Flex>
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

const TotalSize: React.FC<{hasError?: boolean}> = ({
	hasError = false,
	children,
}) => (
	<Text color={hasError ? "error" : "foreground"}>
		{hasError && <DangerIcon />}
		{children}
	</Text>
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
		<Flex direction="column" align="center" width="100%">
			{awaitingPayment && invoice != null ? (
				<>
					<QRCode value={invoice} size={256} />
					<CopyField value={invoice} margin="4" width="288px" />
				</>
			) : (
				<>
					{loading ? (
						<>
							<Loader />
							<Text>{Math.floor(percent * 100)}%</Text>
						</>
					) : (
						<>
							{success ? (
								<CopyField
									value={window.location.hostname + to}
									margin="4"
									width="288px"
								/>
							) : (
								<Dropzone {...dropzone.getRootProps()}>
									<Vault
										files={filesInVault}
										isDragActive={dropzone.isDragActive}
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
					<Text>Total Size</Text>
					<TotalSize hasError={areFilesTooLarge}>{bytes(totalSize)}</TotalSize>
				</InfoRow>

				<InfoRow>
					<Text>Expires After</Text>
					{uploading || success ? (
						<Text>
							{expiryOptions.find((option) => option.value === expiry)?.label}
						</Text>
					) : (
						<Select
							value={expiry}
							options={expiryOptions}
							onChange={(value) => setExpiry(value)}
						/>
					)}
				</InfoRow>

				<InfoRow>
					<Text>Download Limit</Text>
					{uploading || success ? (
						<Text>{downloadLimit}</Text>
					) : (
						<Select
							value={downloadLimit}
							options={downloadLimitOptions.map(({value}) => ({
								value,
								label: value.toString(),
							}))}
							onChange={(value) => setDownloadLimit(value)}
						/>
					)}
				</InfoRow>

				{hasFiles && (
					<InfoRow>
						<Text>Price</Text>
						<Text>${totalSize * 2e-10}</Text>
					</InfoRow>
				)}
			</Info>

			{hasFiles && !loading && !success && (
				<Button onClick={handleClick} disabled={uploadDisabled}>
					Pay & Upload
				</Button>
			)}
		</Flex>
	)
}
