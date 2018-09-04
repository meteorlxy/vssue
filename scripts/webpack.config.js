const pkg = require('../package.json')
const utils = require('./utils')
const webpack = require('webpack')
const portfinder = require('portfinder')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const WebpackBar = require('webpackbar')

/**
 * Generate common loaders for style files
 */
const useCommonStyleLoaders = () => {
  const CSSLoader = {
    loader: 'css-loader',
    options: {
      localIdentName: `[local]_[hash:base64:8]`,
      sourceMap: true
    }
  }

  const PostCSSLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: [require('autoprefixer')],
      sourceMap: true
    }
  }

  return [
    'vue-style-loader',
    CSSLoader,
    PostCSSLoader
  ]
}

const webpackConfig = {
  context: utils.rootPath(),
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    'vssue': './src/entry.full.js'
  },
  output: {
    library: 'Vssue',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': utils.srcPath(),
      'vue$': 'vue/dist/vue.runtime.esm.js'
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          fix: true
        }
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        use: [
          ...useCommonStyleLoaders()
        ]
      },

      {
        test: /\.styl(us)?$/,
        use: [
          ...useCommonStyleLoaders(),
          {
            loader: 'stylus-loader',
            options: {
              preferPathResolver: 'webpack'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    }),

    // Necessary for vue-loader v15+
    new VueLoaderPlugin(),

    new WebpackBar({
      name: 'Vssue',
      color: 'blue',
      compiledIn: false
    }),

    new webpack.HotModuleReplacementPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.rootPath('scripts/dev/index.html'),
      inject: 'head'
    })
  ],

  node: {
    setImmediate: false,
    global: false,
    process: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },

  devServer: {
    contentBase: false,
    hot: true,
    compress: true,
    host: process.platform === 'win32' ? 'localhost' : '0.0.0.0',
    port: 8000,
    quiet: true
  }
}

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = webpackConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      webpackConfig.devServer.port = port
      webpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Webpack dev server listening: http://${webpackConfig.devServer.host}:${port}`]
        }
      }))
      resolve(webpackConfig)
    }
  })
})
