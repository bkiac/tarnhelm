module.exports = {
	"*.ts?(x)": () => "tsc --project tsconfig.json --noEmit",
	"*.{j,t}s?(x)": "eslint --cache --fix",
	"*": "prettier --write",
}
