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
    ...base.extends,

    'airbnb-typescript',
    'airbnb/hooks',

    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],

  plugins: [...base.plugins, 'react-hooks'],

  rules: {
    ...base.rules,
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',

    // Disabled these rules because there are too many false positives in React render function, or template literals
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
  },
};
