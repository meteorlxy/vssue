const path = require('path')

const root = (...args) => path.resolve(__dirname, '../..', ...args)

const src = (...args) => root('src', ...args)

const dist = (...args) => root('dist', ...args)

const assets = (...args) => path.posix.join(...args)

module.exports = {
  root,
  src,
  dist,
  assets
}
