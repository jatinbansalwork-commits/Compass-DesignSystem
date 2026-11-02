const postcss = require('postcss');

const KDESIGN_LAYER_NAME = 'kdesign';

/**
 * Wraps kdesign-core `*.module.css` output in `@layer kdesign` so unlayered consumer
 * classes win the cascade without `!important`.
 */
function postcssKdesignLayer() {
  return {
    postcssPlugin: 'postcss-kdesign-layer',
    OnceExit(root, { result }) {
      const from = result.opts.from ?? '';

      if (!from.includes('.module.css')) {
        return;
      }

      const isKdesignCoreModule =
        from.includes('kdesign-core/') || from.includes('kdesign-core\\');
      if (!isKdesignCoreModule) {
        return;
      }

      const alreadyWrapped = root.nodes.some(
        (node) =>
          node.type === 'atrule' &&
          node.name === 'layer' &&
          node.params.trim() === KDESIGN_LAYER_NAME,
      );
      if (alreadyWrapped) {
        return;
      }

      const layerAtRule = postcss.atRule({ name: 'layer', params: KDESIGN_LAYER_NAME });
      const nodes = [...root.nodes];
      for (const node of nodes) {
        layerAtRule.append(node);
      }
      root.append(layerAtRule);
    },
  };
}

postcssKdesignLayer.postcss = true;

module.exports = postcssKdesignLayer;
