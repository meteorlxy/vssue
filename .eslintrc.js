module.exports = {
  root: true,

  extends: [
    'standard',
    'plugin:vue/recommended',
    'prettier',
    'prettier/standard',
    'prettier/vue',
  ],

  plugins: ['vue', 'prettier'],

  settings: {
    'prettier-vue': {
      SFCBlocks: {
        template: false,
      },
    },
  },

  overrides: [
    // typescript configs
    {
      files: ['*.ts', '*.vue'],

      excludedFiles: ['packages/docs/**/*.vue'],

      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
        'prettier/@typescript-eslint',
      ],

      parser: 'vue-eslint-parser',

      parserOptions: {
        parser: '@typescript-eslint/parser',
      },

      rules: {
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    // jest configs
    {
      files: ['*.spec.ts'],

      env: {
        jest: true,
      },

      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],

  rules: {
    'prettier/prettier': 'error',
  },
};
