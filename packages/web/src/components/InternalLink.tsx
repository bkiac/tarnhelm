import NextLink from "next/link"
import React from "react"
import Link from "./Link"

export type InternalLinkProps = {
	href: string
	as?: React.FC
}

const InternalLink: React.FC<InternalLinkProps> = ({
	href,
	as: Component,
	children,
}) => (
	<NextLink href={href} passHref>
		{/* https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-custom-component-that-wraps-an-a-tag */}
		{/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
		{Component ? <Component>{children}</Component> : <Link>{children}</Link>}
	</NextLink>
)

export default InternalLink
