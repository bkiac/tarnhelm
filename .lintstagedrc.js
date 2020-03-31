module.exports = {
  'package.json': ['prettier-package-json --write'],
  '*.json': ['prettier --write'],
  '*.{js,ts}': ['prettier --write', 'eslint --cache --fix'],
};
