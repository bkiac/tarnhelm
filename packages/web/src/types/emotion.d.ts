import "@emotion/react"
import type {theme} from "../styles/theme"

declare module "@emotion/react" {
	type TarnhelmTheme = typeof theme

	// Must be an interface to extend `emotion` theme
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
	export interface Theme extends TarnhelmTheme {}
}
