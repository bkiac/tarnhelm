import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {SecurityIcon} from "./SecurityIcon"

export default {
	title: "Icons/SecurityIcon",
	component: SecurityIcon,
}

const Template: Story<ComponentProps<typeof SecurityIcon>> = (args) => (
	<SecurityIcon {...args} />
)

export const Main = Template.bind({})
