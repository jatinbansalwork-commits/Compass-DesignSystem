const postcssKdesignLayer = require('./postcss-kdesign-layer.cjs');

module.exports = {
  plugins: [require('postcss-nested'), postcssKdesignLayer, require('autoprefixer')],
};
