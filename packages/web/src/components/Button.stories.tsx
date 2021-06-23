import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {Button} from "./Button"

export default {
	title: "Button",
	component: Button,
}

const Template: Story<ComponentProps<typeof Button>> = (args) => (
	<Button {...args} />
)

export const Main = Template.bind({})
Main.args = {
	children: "Pay & Upload",
}
