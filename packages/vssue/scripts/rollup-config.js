const replace = require('@rollup/plugin-replace');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const vue = require('rollup-plugin-vue');
const typescript = require('@rollup/plugin-typescript');
const babel = require('rollup-plugin-babel');
const { terser } = require('rollup-plugin-terser');

const {
  pkg: { version },
  pathSrc,
  pathDist,
  banner,
} = require('./util');

const browserEntries = [
  'vssue.bitbucket',
  'vssue.gitea',
  'vssue.gitee',
  'vssue.github',
  'vssue.github-v4',
  'vssue.gitlab',
];

module.exports = [
  // Browser iife
  ...browserEntries.map(item => ({
    input: `browser/${item}.ts`,
    output: `${item}.min.js`,
    format: 'iife',
  })),
  // Browser iife with polyfill
  ...browserEntries.map(item => ({
    input: `browser/${item}.ts`,
    output: `${item}.polyfill.min.js`,
    format: 'iife',
  })),
  // ES Module
  {
    input: 'main.ts',
    output: 'vssue.js',
    format: 'es',
  },
].map(opts => {
  const minify = Boolean(/min\.js$/.test(opts.output));
  const polyfill = Boolean(/polyfill\.min\.js$/.test(opts.output));

  const config = {
    input: pathSrc(opts.input),

    output: {
      file: pathDist(opts.output),
      format: opts.format,
      name: 'Vssue',
      banner,
      globals: {
        vue: 'Vue',
      },
    },

    external: [
      'vue',
      ...(opts.format === 'es'
        ? ['@vssue/utils', 'vue-i18n', 'vue-property-decorator']
        : []),
    ],

    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.VUE_APP_VERSION': JSON.stringify(version),
      }),
      resolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
      // https://github.com/rollup/rollup-plugin-typescript/issues/135
      typescript(
        Object.assign(
          {},
          require('../../../tsconfig.base.json').compilerOptions,
          require('../tsconfig.json').compilerOptions
        )
      ),
      vue(),
      ...(opts.format !== 'es' && polyfill
        ? [
            babel({
              babelrc: false,
              presets: ['@vue/app'],
              runtimeHelpers: true,
              extensions: ['.js', '.vue'],
              exclude: [/\/core-js\//, /@babel\/runtime/],
            }),
          ]
        : []),
      ...(minify
        ? [
            terser({
              output: {
                comments: /^!/,
              },
            }),
          ]
        : []),
    ],
  };
  return config;
});
