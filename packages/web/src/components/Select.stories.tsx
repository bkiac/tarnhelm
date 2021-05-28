import React from "react"
import {action} from "@storybook/addon-actions"
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

const onChange = action("change")

export const Expiry = Template.bind({})
Expiry.args = {
	options: expiryOptions,
	value: expiryOptions[0].value,
	onChange,
}

export const DownloadLimit = Template.bind({})
DownloadLimit.args = {
	options: downloadLimitOptions,
	value: downloadLimitOptions[0].value,
	onChange,
}
