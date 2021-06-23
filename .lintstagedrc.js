module.exports = {
	"*.{ts,tsx,js,jsx}": ["eslint --cache --fix", "prettier --write"],
	"*.{json,css,md,yml,yaml}": "prettier --write",
}
