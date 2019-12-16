const fs = require("fs");
const zlib = require('zlib');
const config = require('../config');

const BROTLI_OPTIONS = {
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
  },
};

module.exports = function writeFile(filePath, contents, compress = false) {
  if (typeof contents !== 'string') {
    contents = JSON.stringify(contents);
  }
  if (config.COMPRESS_FILES && compress) {
    contents = zlib.brotliCompressSync(contents, BROTLI_OPTIONS);
  }
  fs.writeFileSync(filePath, contents);
}
