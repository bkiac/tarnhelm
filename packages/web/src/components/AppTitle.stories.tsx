import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {AppTitle} from "./AppTitle"

export default {
	title: "AppTitle",
	component: AppTitle,
}

const Template: Story<ComponentProps<typeof AppTitle>> = (args) => (
	<AppTitle {...args} />
)

export const Main = Template.bind({})
