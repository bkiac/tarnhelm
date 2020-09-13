import axios from "axios"
import { useEffect, useState } from "react"

export default function usePing(): boolean {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function ping(): Promise<void> {
			await axios.get("/ping")
			setLoading(false)
		}

		void ping()
	}, [])

	return loading
}
