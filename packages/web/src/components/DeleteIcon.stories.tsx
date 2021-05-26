import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {DeleteIcon} from "./DeleteIcon"

export default {
	title: "Icons/DeleteIcon",
	component: DeleteIcon,
}

const Template: Story<ComponentProps<typeof DeleteIcon>> = (args) => (
	<DeleteIcon {...args} />
)

export const Main = Template.bind({})
