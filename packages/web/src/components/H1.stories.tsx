import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {H1} from "./H1"

export default {
	title: "H1",
	component: H1,
}

const Template: Story<ComponentProps<typeof H1>> = (args) => <H1 {...args} />

export const Main = Template.bind({})
Main.args = {
	children: "h1 Heading",
}
