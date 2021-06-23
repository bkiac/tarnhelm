import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {FileStick} from "./FileStick"

export default {
	title: "FileStick",
	component: FileStick,
}

const Template: Story<ComponentProps<typeof FileStick>> = (args) => (
	<FileStick {...args} />
)

export const Main = Template.bind({})
Main.args = {
	name: "file.zip",
	size: 8000,
}
