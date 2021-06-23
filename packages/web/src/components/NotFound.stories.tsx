import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {NotFound} from "./NotFound"

export default {
	title: "NotFound",
	component: NotFound,
}

const Template: Story<ComponentProps<typeof NotFound>> = (args) => (
	<NotFound {...args} />
)

export const Main = Template.bind({})
