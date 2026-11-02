import type { Plugin } from 'vite';
import type { KdesignPluginOptions } from './types.js';

export type { KdesignPluginOptions };

/**
 * Builds the app's `kdesign-icons` font from the icons it imports, from
 * `@klearnow/kdesign-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL, drawn as a mask.
 *
 * ```ts
 * import kdesignPlugin from '@klearnow/kdesign-svelte/configs/vite';
 *
 * export default defineConfig({ plugins: [kdesignPlugin({ extra: './src/icons' })] });
 * ```
 */
declare function kdesignPlugin(options?: KdesignPluginOptions): Plugin[];
export default kdesignPlugin;
