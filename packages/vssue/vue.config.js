const path = require('path')
const { version } = require('./package.json')

process.env.VUE_APP_VERSION = version

module.exports = {
  lintOnSave: process.env.NODE_ENV === 'development',

  chainWebpack: config => {
    config.resolve.alias
      .set('vssue$', path.resolve(__dirname, process.env.VSSUE_PATH))
      .set('vssue/dist/vssue.min.css$', path.resolve(__dirname, process.env.VSSUE_CSS_PATH))
      .set('@vssue/api$', `@vssue/api-${process.env.VSSUE_API}`)

    if (process.env.NODE_ENV === 'development') {
      config.resolve.alias
        .set('@vssue/api$', `@vssue/api-${process.env.VSSUE_API}/src/index.ts`)
        .set('@vssue/utils', `@vssue/utils/src/index.ts`)

      config.module
        .rule('eslint')
        .use('eslint-loader')
        .loader('eslint-loader')
        .tap(options => {
          options.fix = true
          return options
        })
    }
  },
}
