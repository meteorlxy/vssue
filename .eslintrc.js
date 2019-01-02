module.exports = {
  root: true,

  env: {
    node: true,
  },

  parser: 'typescript-eslint-parser',

  extends: [
    '@vue/standard',
    '@vue/typescript',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': ['error', 'always-multiline'],

    // https://github.com/eslint/typescript-eslint-parser/issues/485
    'no-useless-constructor': 'off',
  },
}
