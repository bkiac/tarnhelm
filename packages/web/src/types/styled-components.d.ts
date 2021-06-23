import "styled-components"
import type {theme} from "../styles/theme"

declare module "styled-components" {
	export type DefaultThemeIconContentCodes = typeof theme.iconContentCodes
	export type DefaultThemeColors = typeof theme.colors
	export type DefaultThemePalette = typeof theme.palette

	// Must be an interface to extend `styled-components` theme
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	export interface DefaultTheme {
		iconContentCodes: DefaultThemeIconContentCodes
		colors: DefaultThemeColors
		palette: DefaultThemePalette
	}
}
