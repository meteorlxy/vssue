const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const vue = require('rollup-plugin-vue').default
const typescript = require('rollup-plugin-typescript')
const babel = require('rollup-plugin-babel')
const { uglify } = require('rollup-plugin-uglify')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const path = require('path')

const { version } = require('./package.json')

const pathSrc = (...args) => path.resolve(__dirname, 'src', ...args)
const pathDist = (...args) => path.resolve(__dirname, 'dist', ...args)

module.exports = [
  {
    input: 'vssue.bitbucket.ts',
    output: 'vssue.bitbucket.min.js',
    format: 'umd',
  },
  {
    input: 'vssue.github.ts',
    output: 'vssue.github.min.js',
    format: 'umd',
  },
  {
    input: 'vssue.gitlab.ts',
    output: 'vssue.gitlab.min.js',
    format: 'umd',
  },
  {
    input: 'main.ts',
    output: 'vssue.common.js',
    format: 'cjs',
  },
  {
    input: 'main.ts',
    output: 'vssue.esm.js',
    format: 'es',
  },
].map(opts => {
  const minify = Boolean(/min\.js$/.test(opts.output))

  const config = {
    input: pathSrc(opts.input),

    output: {
      file: opts.output,
      format: opts.format,
      dir: pathDist(),
      name: 'Vssue',
      globals: {
        'vue': 'Vue',
      },
    },

    external: [
      'vue',
      ...(opts.format === 'es' || opts.format === 'cjs' ? [
        '@vssue/utils',
      ] : []),
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
      typescript(),
      vue(),
      babel({
        babelrc: false,
        presets: ['@vue/app'],
        runtimeHelpers: true,
        extensions: ['.js', '.vue'],
        exclude: [/\/core-js\//, /@babel\/runtime/],
      }),
      ...(minify ? [uglify()] : []),
    ],
  }
  return config
})
