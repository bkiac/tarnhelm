import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {Loader} from "./Loader"

export default {
	title: "Loader",
	component: Loader,
}

const Template: Story<ComponentProps<typeof Loader>> = (args) => (
	<div
		style={{
			height: "100%",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		}}
	>
		<Loader {...args} />
	</div>
)

export const Main = Template.bind({})
