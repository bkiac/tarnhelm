import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {DeathIcon} from "./DeathIcon"

export default {
	title: "Icons/DeathIcon",
	component: DeathIcon,
}

const Template: Story<ComponentProps<typeof DeathIcon>> = (args) => (
	<DeathIcon {...args} />
)

export const Main = Template.bind({})
