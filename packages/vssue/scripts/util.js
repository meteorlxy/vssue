const path = require('path');
const pkg = require('../package.json');

const pathSrc = (...args) => path.resolve(__dirname, '../src', ...args);
const pathDist = (...args) => path.resolve(__dirname, '../dist', ...args);

const banner = `\
/*!
 * ${pkg.name} - ${pkg.description}
 *
 * @version v${pkg.version}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 * @copyright 2018-${new Date().getFullYear()} meteorlxy
 */
`;

const arrayToChunks = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

module.exports = {
  pkg,
  pathSrc,
  pathDist,
  banner,
  arrayToChunks,
};
