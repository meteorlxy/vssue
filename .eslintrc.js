module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    'plugin:vue/strongly-recommended',
    'plugin:jest/recommended',
    'standard'
  ],
  "globals": {
    "__VERSION__": true
  }
}
