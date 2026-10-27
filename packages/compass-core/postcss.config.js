const postcssKlear360Layer = require('./postcss-blade-layer.cjs');

module.exports = {
  plugins: [require('postcss-nested'), postcssKlear360Layer, require('autoprefixer')],
};
