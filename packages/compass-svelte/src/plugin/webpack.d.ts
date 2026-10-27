import type { Compiler } from 'webpack';
import type { CompassPluginOptions } from './types.js';

export type { CompassPluginOptions };

/** The webpack 5 font plugin; `compassPlugin()` makes one. */
export declare class CompassPlugin {
  constructor(options?: CompassPluginOptions);
  apply(compiler: Compiler): void;
}

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@klearnow/compass-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL (give SVGs an asset rule).
 *
 * ```js
 * import compassPlugin from '@klearnow/compass-svelte/configs/webpack';
 *
 * export default { plugins: [compassPlugin({ extra: './src/icons' })] };
 * ```
 */
declare function compassPlugin(options?: CompassPluginOptions): CompassPlugin;
export default compassPlugin;
