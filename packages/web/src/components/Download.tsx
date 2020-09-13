import bytes from "bytes"
import React, { useCallback, useState } from "react"
import { Redirect, useParams } from "react-router-dom"
import { useDownload } from "../hooks"

const Download: React.FC = () => {
	const { id, secretb64 } = useParams<{ id: string; secretb64: string }>()

	const [count, setCount] = useState(0)
	const [state, download] = useDownload(id, secretb64)
	const { status, loading, metadata, error } = state

	const handleClick = useCallback(() => {
		setCount((c) => c + 1)
		return download()
	}, [download])

	if (error) return <Redirect to="/404" />

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

export default Download
