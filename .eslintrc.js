module.exports = {
	root: true,
	ignorePatterns: [
		"node_modules",
		"dist",
		"_static",
		".next",
		"*rc.js",
		"commitlint.config.js",
	],
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
		},
	],
}
