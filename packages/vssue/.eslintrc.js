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
    'no-console': 'off',
    'comma-dangle': ['error', 'always-multiline'],
  },
}
