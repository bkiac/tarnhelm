import React from "react"
import {action} from "@storybook/addon-actions"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {Vault} from "./Vault"

export default {
	title: "Vault",
	component: Vault,
}

const Template: Story<ComponentProps<typeof Vault>> = (args) => (
	<Vault {...args} />
)

const createDeleteAction = (id: string): ReturnType<typeof action> =>
	action(`delete ${id}`)

const files = [
	{
		id: "0",
		name: "file.zip",
		size: 40000,
		onDelete: createDeleteAction("0"),
	},
	{
		id: "1",
		name: "file2.zip",
		size: 3800,
		onDelete: createDeleteAction("1"),
	},
	{
		id: "2",
		name: "image.png",
		size: 123456,
		onDelete: createDeleteAction("2"),
	},
]

export const Empty = Template.bind({})
Empty.args = {}

export const DragActive = Template.bind({})
DragActive.args = {
	isDragActive: true,
}

export const Files = Template.bind({})
Files.args = {
	files,
}

export const Error = Template.bind({})
Error.args = {
	hasError: true,
}
