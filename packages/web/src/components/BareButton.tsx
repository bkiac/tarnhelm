import React from "react"
import {Box} from "@chakra-ui/react"
import type {BoxProps} from "@chakra-ui/react"

export type BareButtonProps = Omit<
	BoxProps & React.HTMLProps<HTMLButtonElement>,
	"ref" // Remove `ref` to fix Box default `div` and `button` HTML element type mismatch
>

export const BareButton: React.VFC<BareButtonProps> = (props) => (
	<Box {...props} as="button" type="button" />
)
