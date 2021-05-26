import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {Footer} from "./Footer"

export default {
	title: "Footer",
	component: Footer,
}

const Template: Story<ComponentProps<typeof Footer>> = (args) => (
	<Footer {...args} />
)

export const Main = Template.bind({})
