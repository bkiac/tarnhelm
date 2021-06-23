const iconContentCodes = {
	delete: "\\e900",
	save: "\\e901",
	death: "\\e902",
	danger: "\\e903",
	security: "\\e904",
} as const

const colors = {
	black: "#000",
	white: "#fff",
	broom: "#ffed0b",
	cyan: "#06f0fd",
	radicalRed: "#ff2865",
	sangria: "#9a0006",
	mediumPurple: "#a13be0",
} as const

const palette = {
	background: colors.black,
	foreground: colors.white,
	primary: colors.broom,
	secondary: colors.cyan,
	tertiary: colors.radicalRed,
	error: colors.sangria,
} as const

export const theme = {
	iconContentCodes,
	colors,
	palette,
} as const
