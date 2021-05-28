import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {SaveIcon} from "./SaveIcon"

export default {
	title: "Icons/SaveIcon",
	component: SaveIcon,
}

const Template: Story<ComponentProps<typeof SaveIcon>> = (args) => (
	<SaveIcon {...args} />
)

export const Main = Template.bind({})
