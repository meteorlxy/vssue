const configConventional = require('@commitlint/config-conventional');

module.exports = {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-lerna-scopes',
  ],

  rules: {
    'type-enum': [
      configConventional.rules['type-enum'][0],
      configConventional.rules['type-enum'][1],
      ['release', ...configConventional.rules['type-enum'][2]],
    ],
  },
};
