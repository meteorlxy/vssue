module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard',
    '@vue/typescript',
  ],

  rules: {
    'comma-dangle': ['error', 'always-multiline'],

    // https://github.com/eslint/typescript-eslint-parser/issues/485
    'no-useless-constructor': 'off',
  },
}
