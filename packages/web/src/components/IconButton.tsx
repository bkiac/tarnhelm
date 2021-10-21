import React from "react"
import type {BareButtonProps} from "./BareButton"
import {BareButton} from "./BareButton"

export const IconButton: React.VFC<
	BareButtonProps & {children: React.ReactNode}
> = ({children, ...props}) => (
	<BareButton
		border="none"
		cursor="pointer"
		outline="inherit"
		color="foreground"
		background="tertiary"
		padding="0"
		{...props}
	>
		{children}
	</BareButton>
)
