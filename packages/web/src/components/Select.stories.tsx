import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {Select} from "./Select"
import {downloadLimitOptions, expiryOptions} from "../utils"

export default {
	title: "Select",
	component: Select,
}

const Template: Story<ComponentProps<typeof Select>> = (args) => (
	<Select {...args} />
)

export const Expiry = Template.bind({})
Expiry.args = {
	options: expiryOptions,
	value: expiryOptions[0].value,
}

export const DownloadLimit = Template.bind({})
DownloadLimit.args = {
	options: downloadLimitOptions,
	value: downloadLimitOptions[0].value,
}
