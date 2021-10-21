import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {BareButton} from "./BareButton"

export default {
	title: "Buttons/BareButton",
	component: BareButton,
}

const Template: Story<ComponentProps<typeof BareButton>> = (args) => (
	<BareButton {...args} />
)

export const Main = Template.bind({})
Main.args = {
	children: "Button",
}
