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
  },
};
