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
Main.args = {
	value:
		"lnbcrt500u1ps5ettwpp5y5zt2hr5s5gezwj7cqh59d4www4jv6phuqy22r0rde4usvq4zrzsdqqcqzpgxqyz5vqsp57ghfpfuk6pguuwwnuwes0vt37as26740mejad0u3urvrwddzcm5q9qyyssq7mekfcl0k2vzhsqmuf4c5z7mhm702ka3cagq5yj2khnk29w5lku3nknd0fg75aemydvyxhl3sm8va3x7x97g02d0skr20ej9tsyypdsqdmg4uu",
}
