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
  },
}
