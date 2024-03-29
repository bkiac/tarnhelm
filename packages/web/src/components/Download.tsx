import bytes from "bytes"
import {useRouter} from "next/router"
import React, {useCallback, useState} from "react"
import {Text} from "@chakra-ui/react"
import {useDownload} from "../hooks"
import {Button} from "./Button"

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
				{status === 0 && <Text>Setting up keys...</Text>}

				{metadata && (
					<>
						<div>Name: {metadata.name}</div>
						<div>Size: {bytes(metadata.size)}</div>
					</>
				)}

				{status !== 0 && loading && <Text>...</Text>}

				{!loading && count === 0 && (
					<Button onClick={handleClick} disabled={loading}>
						Download
					</Button>
				)}
			</div>
		</>
	)
}
