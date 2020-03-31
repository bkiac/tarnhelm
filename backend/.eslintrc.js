const base = require('../.eslintrc');

module.exports = {
  ...base,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript/base',
    'prettier',
    'prettier/@typescript-eslint',
  ],
};
