import {extendTheme} from "@chakra-ui/react"

const iconContentCodes = {
	delete: "\\e900",
	save: "\\e901",
	death: "\\e902",
	danger: "\\e903",
	security: "\\e904",
} as const

const colorPalette = {
	black: "#000",
	white: "#fff",
	broom: "#ffed0b",
	cyan: "#06f0fd",
	radicalRed: "#ff2865",
	sangria: "#9a0006",
	mediumPurple: "#a13be0",
} as const

const colors = {
	...colorPalette,
	background: colorPalette.black,
	foreground: colorPalette.white,
	primary: colorPalette.broom,
	secondary: colorPalette.cyan,
	tertiary: colorPalette.radicalRed,
	error: colorPalette.sangria,
} as const

const fonts = {
	body: "DotGothic16, sans-serif",
	heading: "Dosis, sans-serif",
	mono: "VT323, monospace",
	brand: "Paytone One, sans-serif",
} as const

const styles = {
	global: {
		body: {
			bg: "black",
			color: "white",
		},
	},
} as const

export const theme = extendTheme({
	iconContentCodes,
	colors,
	fonts,
	styles,
})
