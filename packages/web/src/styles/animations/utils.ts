import type {Keyframes} from "@emotion/serialize"

/**
 * Helper function for bundling animation with its common properties.
 * `emotion` does not allow `styled-components` style CSS snippets,
 * returned keyframes and properties string have to manually applied in CSS.
 * See: https://github.com/emotion-js/emotion/issues/2397
 */
export type EmotionAnimationSnippet<TArgs> = (
	args: TArgs,
) => [Keyframes, string]
