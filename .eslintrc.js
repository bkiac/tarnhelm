module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  // extends: [
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:@typescript-eslint/recommended-requiring-type-checking',
  //   'prettier',
  //   'prettier/@typescript-eslint',
  // ],
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],

    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],

    'import/prefer-default-export': 'off',

    'prettier/prettier': 'error',

    'no-console': 'error',
    'no-underscore-dangle': 'off',
  },
};
