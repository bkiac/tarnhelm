import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {NoisyIconButton} from "./NoisyIconButton"
import {DeleteIcon} from "./DeleteIcon"

export default {
	title: "Buttons/NoisyIconButton",
	component: NoisyIconButton,
}

const Template: Story<ComponentProps<typeof NoisyIconButton>> = (args) => (
	<NoisyIconButton {...args} />
)

export const Main = Template.bind({})
Main.args = {
	children: <DeleteIcon />,
	fontSize: "4xl",
}
