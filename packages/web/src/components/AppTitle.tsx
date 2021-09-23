import React from "react"
import {A} from "./A"
import {InternalLink} from "./InternalLink"
import {BrandText} from "./BrandText"

const title = "Tarnhelm"

export const AppTitle: React.FC = () => (
	<InternalLink href="/" as={A}>
		<BrandText as="span">{title}</BrandText>
	</InternalLink>
)
