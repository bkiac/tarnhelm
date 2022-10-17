module.exports = {
	root: true,
	ignorePatterns: ["node_modules", "dist", "_static", ".next", "*rc.js"],
	overrides: [
		{
			env: {
				node: true,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: "./packages/api/tsconfig.json",
			},
			files: "packages/api/**",
			extends: ["bkiac/base"],
		},
		{
			env: {
				browser: true,
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: "./packages/web/tsconfig.json",
				ecmaFeatures: {
					jsx: true,
				},
			},
			files: "packages/web/**",
			extends: ["bkiac"],
			rules: {
				"react/require-default-props": "off",
			},
			overrides: [
				{
					files: "*.stories.tsx",
					rules: {
						"import/no-anonymous-default-export": "off",
					},
				},
			],
		},
	],
}
