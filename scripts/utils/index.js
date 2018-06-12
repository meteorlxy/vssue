
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('./path')

const useCommonStyleLoaders = () => {
  const isProd = process.env.NODE_ENV === 'production'

  const CSSLoader = {
    loader: 'css-loader',
    options: {
      localIdentName: `[local]_[hash:base64:8]`,
      sourceMap: !isProd
    }
  }

  const PostCSSLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: [require('autoprefixer')],
      sourceMap: !isProd
    }
  }

  return [
    isProd
      ? MiniCssExtractPlugin.loader
      : 'vue-style-loader',
    CSSLoader,
    PostCSSLoader
  ]
}

module.exports = {
  path,
  useCommonStyleLoaders
}
