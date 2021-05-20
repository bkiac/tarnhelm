import isNil from "lodash/isNil"
import {useEffect, useMemo, useRef} from "react"

export function useInterval(callback: () => void, delay?: number): void {
	const savedCallback = useRef<() => void>(callback)
	const isRunning = useMemo(() => !isNil(delay), [delay])

	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	useEffect(() => {
		let id: NodeJS.Timeout
		if (isRunning) {
			id = setInterval(() => savedCallback.current(), delay)
		}
		return () => clearInterval(id)
	}, [isRunning, delay])
}
