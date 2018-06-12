const pkg = require('../../package.json')
const utils = require('../utils')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackBar = require('webpackbar')

const webpackBaseConfig = {
  context: utils.path.root(),
  entry: {
    'vssue': './src/entry.full.js'
  },
  output: {
    path: utils.path.dist(),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': utils.path.src(),
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
          ...utils.useCommonStyleLoaders()
        ]
      },

      {
        test: /\.styl(us)?$/,
        use: [
          ...utils.useCommonStyleLoaders(),
          {
            loader: 'stylus-loader',
            options: {
              preferPathResolver: 'webpack'
            }
          }
        ]
      },

      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.path.assets('fonts/[name].[ext]')
        }
      },

      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.path.assets('img/[name].[ext]')
        }
      },

      {
        test: /\.(svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: utils.path.assets('img/[name].[ext]')
        }
      }
    ]
  },
  plugins: [
    // Necessary for vue-loader v15+
    new VueLoaderPlugin(),

    new WebpackBar({
      name: 'Vssue',
      color: 'blue',
      compiledIn: false
    }),

    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
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
  }
}

module.exports = webpackBaseConfig
