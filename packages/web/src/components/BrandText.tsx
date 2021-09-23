import React from "react"
import type {ComponentProps} from "react"
import {DistortedText} from "./DistortedText"

export const BrandText: React.FC<ComponentProps<typeof DistortedText>> = (
	props,
) => (
	<DistortedText
		fontFamily="brand"
		fontStyle="italic"
		fontWeight="bold"
		fontSize="4xl"
		textTransform="uppercase"
		{...props}
		as="span"
	/>
)
