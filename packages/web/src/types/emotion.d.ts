import "@emotion/react"
import type * as theme from "../styles/theme"

declare module "@emotion/react" {
	export type ThemeIconContentCodes = typeof theme.iconContentCodes
	export type ThemeColors = typeof theme.colors
	export type ThemePalette = typeof theme.palette

	// Must be an interface to merge `@emotion/react` theme
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface Theme {
		iconContentCodes: ThemeIconContentCodes
		colors: ThemeColors
		palette: ThemePalette
	}
}
