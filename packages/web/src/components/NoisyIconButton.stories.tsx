import React from "react"
import type {ComponentProps} from "react"
import type {Story} from "@storybook/react"
import {NoisyIconButton} from "./NoisyIconButton"
import {DangerIcon} from "./DangerIcon"

export default {
	title: "Buttons/NoisyIconButton",
	component: NoisyIconButton,
}

const Template: Story<ComponentProps<typeof NoisyIconButton>> = (args) => (
	<NoisyIconButton {...args} />
)

export const Main = Template.bind({
	children: <DangerIcon />,
})
