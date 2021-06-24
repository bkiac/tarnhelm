import "styled-components"
import type {theme} from "../styles/theme"

declare module "styled-components" {
	type Theme = typeof theme

	// Must be an interface to extend `styled-components` theme
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-empty-interface
	export interface DefaultTheme extends Theme {}
}
