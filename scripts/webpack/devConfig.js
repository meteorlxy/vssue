const portfinder = require('portfinder')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const webpackBaseConfig = require('./baseConfig')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const utils = require('../utils')

const webpackDevConfig = webpackMerge(webpackBaseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  output: {
    library: 'Vssue',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  devServer: {
    contentBase: false,
    hot: true,
    compress: true,
    host: process.platform === 'win32' ? 'localhost' : '0.0.0.0',
    port: 8000,
    quiet: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.path.root('scripts/dev/index.html'),
      inject: 'head'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = webpackDevConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      webpackDevConfig.devServer.port = port
      webpackDevConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Webpack dev server listening: http://${webpackDevConfig.devServer.host}:${port}`]
        }
      }))
      resolve(webpackDevConfig)
    }
  })
})
