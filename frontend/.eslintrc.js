const base = require('../.eslintrc');

module.exports = {
  ...base,
  env: {
    browser: true,
  },
  parserOptions: {
    ...base.parserOptions,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript',
    'airbnb/hooks',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: [...base.plugins, 'react-hooks'],
};
