import "styled-components"

declare module "styled-components" {
	export interface DefaultThemeIconContentCodes {
		delete: "\\e900"
		save: "\\e901"
		death: "\\e902"
		danger: "\\e903"
		security: "\\e904"
	}

	export interface DefaultThemeColors {
		black: string
		white: string
		broom: string
		cyan: string
		sangria: string
		radicalRed: string
		mediumPurple: string
	}

	export interface DefaultThemePalette {
		background: string
		foreground: string
		primary: string
		secondary: string
		tertiary: string
		error: string
	}

	export interface DefaultTheme {
		iconContentCodes: DefaultThemeIconContentCodes
		colors: DefaultThemeColors
		palette: DefaultThemePalette
	}
}
