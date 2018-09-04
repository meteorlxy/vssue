const fs = require('fs')
const utils = require('./utils')

fs.copyFile(
  utils.rootPath('scripts/dev/index.sample.html'),
  utils.rootPath('scripts/dev/index.html'),
  fs.constants.COPYFILE_EXCL,
  (err) => {
    if (err) {
      console.log('Copy "scripts/dev/index.sample.html" to "scripts/dev/index.html" failed. Skip')
    } else {
      console.log('Copied "scripts/dev/index.sample.html" to "scripts/dev/index.html"')
    }
  }
)
