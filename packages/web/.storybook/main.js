const path = require("path")

const toPath = (p) => path.join(process.cwd(), p)

module.exports = {
	stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		{
			name: "@storybook/addon-essentials",
			options: {
				backgrounds: false,
			},
		},
	],
	/**
	 * This webpack config is needed to force Storybook to use Emotion 11:
	 * - https://github.com/storybookjs/storybook/issues/12262
	 * - https://github.com/storybookjs/storybook/issues/10231
	 * - https://github.com/storybookjs/storybook/issues/10231#issuecomment-728038867
	 */
	webpackFinal: async (config) => {
		return {
			...config,
			resolve: {
				...config.resolve,
				alias: {
					...config.resolve.alias,
					"@emotion/core": toPath("node_modules/@emotion/react"),
					"emotion-theming": toPath("node_modules/@emotion/react"),
				},
			},
		}
	},
}
