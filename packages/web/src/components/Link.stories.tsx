import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {Link} from "./Link"

export default {
	title: "Link",
	component: Link,
}

const Template: Story<ComponentProps<typeof Link>> = (args) => (
	<Link {...args} />
)

export const Main = Template.bind({})
Main.args = {
	children: "Link",
	href: "https://github.com/bkiac/tarnhelm",
}
