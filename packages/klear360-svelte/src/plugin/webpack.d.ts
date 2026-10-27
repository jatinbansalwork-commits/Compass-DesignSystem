import type { Compiler } from 'webpack';
import type { Klear360PluginOptions } from './types.js';

export type { Klear360PluginOptions };

/** The webpack 5 font plugin; `klear360Plugin()` makes one. */
export declare class Klear360Plugin {
  constructor(options?: Klear360PluginOptions);
  apply(compiler: Compiler): void;
}

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@klearnow/klear360-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL (give SVGs an asset rule).
 *
 * ```js
 * import klear360Plugin from '@klearnow/klear360-svelte/configs/webpack';
 *
 * export default { plugins: [klear360Plugin({ extra: './src/icons' })] };
 * ```
 */
declare function klear360Plugin(options?: Klear360PluginOptions): Klear360Plugin;
export default klear360Plugin;
