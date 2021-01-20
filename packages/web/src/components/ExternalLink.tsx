import React from "react"
import { Link } from "./Link"

type Target = "_blank" | "_self" | "_parent" | "_top"

const noopener = "noopener"
const noreferrer = "noreferrer"

function createSafeRel(rel?: string): string {
	if (rel == null) {
		return `${noopener} ${noreferrer}`
	}
	const attrs = rel.split(" ").filter((attr) => attr === "")
	if (!attrs.includes(noopener)) {
		attrs.push(noopener)
	}
	if (!attrs.includes(noreferrer)) {
		attrs.push(noreferrer)
	}
	return attrs.join(" ")
}

export const ExternalLink: React.FC<{
	href: string
	target?: Target
	rel?: string
}> = ({ href, target, rel, children }) => (
	<Link
		href={href}
		target={target}
		rel={target === "_blank" ? createSafeRel(rel) : rel}
	>
		{children}
	</Link>
)
