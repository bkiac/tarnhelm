import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {BrandText} from "./BrandText"

export default {
	title: "BrandText",
	component: BrandText,
}

const Template: Story<ComponentProps<typeof BrandText>> = (args) => (
	<BrandText {...args} />
)

export const Main = Template.bind({})
Main.args = {
	children: "Brand Text",
}
