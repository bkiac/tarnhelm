import React from "react"
import {Box} from "@chakra-ui/react"
import type {HTMLChakraProps} from "@chakra-ui/react"

export type BareButtonProps = Omit<HTMLChakraProps<"button">, "as">

export const BareButton: React.VFC<BareButtonProps> = (props) => (
	// @ts-expect-error Props of div and button HTML elements do not match, but this box will always be rendered as a button, so it should be fine
	<Box {...props} as="button" type="button" />
)
