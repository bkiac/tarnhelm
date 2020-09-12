const base = require('../.eslintrc');

module.exports = {
  ...base,

  env: {
    node: true,
  },

  extends: [...base.extends, 'airbnb-typescript/base', 'prettier', 'prettier/@typescript-eslint'],
};
