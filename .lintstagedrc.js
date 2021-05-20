module.exports = {
	"/packages/api/*.{ts,tsx}": () =>
		"tsc --project /packages/api/tsconfig.json --noEmit",
	"/packages/web/*.{ts,tsx}": () =>
		"tsc --project /packages/web/tsconfig.json --noEmit",

	"*.ts,tsx,js": "eslint --cache --fix",

	"*.{ts,tsx,js,jsx,json,css,md}": "prettier --write",
}
