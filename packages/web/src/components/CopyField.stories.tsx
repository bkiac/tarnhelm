import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {CopyField} from "./CopyField"

export default {
	title: "CopyField",
	component: CopyField,
}

const Template: Story<ComponentProps<typeof CopyField>> = (args) => (
	<CopyField {...args} />
)

export const Main = Template.bind({})
