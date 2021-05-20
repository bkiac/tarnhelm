import bytes from "bytes"
import {useRouter} from "next/router"
import React, {useCallback, useState} from "react"
import {useDownload} from "../hooks"

export type DownloadProps = {
	id: string
	secretb64: string
}

export const Download: React.FC<DownloadProps> = ({id, secretb64}) => {
	const router = useRouter()

	const [state, download] = useDownload(id, secretb64)
	const {status, loading, metadata, error} = state

	const [count, setCount] = useState(0)
	const handleClick = useCallback(() => {
		setCount((c) => c + 1)
		download()
	}, [download])

	if (error) {
		void router.push("/404")
		return null
	}

	return (
		<>
			<div>ID: {id}</div>
			<div>Secret: {secretb64}</div>
			<div>
				{status === 0 && <p>Setting up keys...</p>}

				{metadata && (
					<>
						<div>Name: {metadata.name}</div>
						<div>Size: {bytes(metadata.size)}</div>
					</>
				)}

				{status !== 0 && loading && <p>...</p>}

				{!loading && count === 0 && (
					<button type="button" onClick={handleClick} disabled={loading}>
						Download
					</button>
				)}
			</div>
		</>
	)
}
