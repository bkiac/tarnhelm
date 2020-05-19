const base = require('../.lintstagedrc');

module.exports = {
  ...base,
  '*.{html,css,scss}': ['prettier --write'],
  '*.tsx': ['prettier --write', 'eslint --cache --fix'],
};
