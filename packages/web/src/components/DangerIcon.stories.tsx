import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {DangerIcon} from "./DangerIcon"

export default {
	title: "Icons/DangerIcon",
	component: DangerIcon,
}

const Template: Story<ComponentProps<typeof DangerIcon>> = (args) => (
	<DangerIcon {...args} />
)

export const Main = Template.bind({})
