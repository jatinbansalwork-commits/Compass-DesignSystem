import type { Plugin } from 'vite';
import type { CompassPluginOptions } from './types.js';

export type { CompassPluginOptions };

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@klearnow/compass-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL, drawn as a mask.
 *
 * ```ts
 * import compassPlugin from '@klearnow/compass-svelte/configs/vite';
 *
 * export default defineConfig({ plugins: [compassPlugin({ extra: './src/icons' })] });
 * ```
 */
declare function compassPlugin(options?: CompassPluginOptions): Plugin[];
export default compassPlugin;
