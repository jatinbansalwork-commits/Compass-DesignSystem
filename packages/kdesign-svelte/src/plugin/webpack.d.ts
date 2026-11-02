import type { Compiler } from 'webpack';
import type { KdesignPluginOptions } from './types.js';

export type { KdesignPluginOptions };

/** The webpack 5 font plugin; `kdesignPlugin()` makes one. */
export declare class KdesignPlugin {
  constructor(options?: KdesignPluginOptions);
  apply(compiler: Compiler): void;
}

/**
 * Builds the app's `kdesign-icons` font from the icons it imports, from
 * `@klearnow/kdesign-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL (give SVGs an asset rule).
 *
 * ```js
 * import kdesignPlugin from '@klearnow/kdesign-svelte/configs/webpack';
 *
 * export default { plugins: [kdesignPlugin({ extra: './src/icons' })] };
 * ```
 */
declare function kdesignPlugin(options?: KdesignPluginOptions): KdesignPlugin;
export default kdesignPlugin;
