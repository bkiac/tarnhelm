import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {DistortedText} from "./DistortedText"

export default {
	title: "DistortedText",
	component: DistortedText,
}

const Template: Story<ComponentProps<typeof DistortedText>> = (args) => (
	<DistortedText {...args} />
)

export const Main = Template.bind({})
Main.args = {
	children: "Distorted Text",
}
