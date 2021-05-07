module.exports = {
	//"*.ts?(x)": () => "tsc --project tsconfig.json --noEmit",
	//"*.{j,t}s?(x)": "eslint --cache --fix",
	"*.{ts,tsx,js,jsx,json,css,md}": "prettier --write",
}
