import React, { useEffect, useState } from "react"

export const TippinButton: React.FC = () => {
	const [, setInitialized] = useState(false)
	useEffect(() => {
		setInitialized(true)
	}, [])
	return (
		<>
			<div id="tippin-button" data-dest="bkiac" />
			<script
				src="https://tippin.me/buttons/tip.js?0001"
				type="text/javascript"
			/>
		</>
	)
}
