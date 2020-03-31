const base = require('../.lintstagedrc');

module.exports = {
  ...base,
  '*.html': ['prettier --write'],
  '*.tsx': ['prettier --write', 'eslint --cache --fix'],
};
