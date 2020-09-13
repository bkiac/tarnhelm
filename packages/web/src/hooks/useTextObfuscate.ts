import { useCallback, useEffect, useState } from "react"
import * as utils from "../utils"
import useInterval from "./useInterval"

export default function useTextObfuscate(
	defaultText: string,
	delay: number,
): [string, () => void] {
	const [text, setText] = useState(defaultText)

	const [array, setArray] = useState<string[]>([])
	const [index, setIndex] = useState(0)
	const [isRunning, setIsRunning] = useState(false)

	useEffect(() => {
		setText(defaultText)
		setIsRunning(false)
	}, [defaultText])

	const obfuscate = useCallback(() => {
		setArray(utils.obfuscate(defaultText))
		setIsRunning(true)
	}, [defaultText])

	useInterval(
		() => {
			if (index < array.length) {
				setText(array[index])
				setIndex(index + 1)
			} else {
				setIndex(0)
				setIsRunning(false)
			}
		},
		isRunning ? delay : undefined,
	)

	return [text, obfuscate]
}
