const pkg = require('../../package.json')
const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./baseConfig')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const baseBuildConfig = webpackMerge(webpackBaseConfig, {
  mode: 'production',

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'vssue.css'
    }),

    new OptimizeCssAssetsPlugin({
      canPrint: false,
      cssProcessorOptions: {
        safe: true,
        autoprefixer: { disable: true },
        mergeLonghand: false
      }
    })
  ]
})

const fullConfig = {
  output: {
    filename: '[name].full.js',
    library: 'Vssue',
    libraryTarget: 'umd',
    libraryExport: 'default'
  }
}

const componentConfig = {
  entry: {
    'vssue': './src/entry.component.js'
  },
  output: {
    filename: '[name].component.js',
    library: 'Vssue',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  externals: Object.keys(pkg.dependencies)
}

const webpackBuildConfig = [
  webpackMerge(baseBuildConfig, fullConfig),
  webpackMerge(baseBuildConfig, componentConfig)
]

module.exports = webpackBuildConfig
