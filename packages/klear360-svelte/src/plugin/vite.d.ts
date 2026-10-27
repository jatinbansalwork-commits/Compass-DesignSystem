import type { Plugin } from 'vite';
import type { Klear360PluginOptions } from './types.js';

export type { Klear360PluginOptions };

/**
 * Builds the app's `blade-icons` font from the icons it imports, from
 * `@klearnow/klear360-svelte/icons` and from the `extra` folders. Without it,
 * every icon import is its SVG's URL, drawn as a mask.
 *
 * ```ts
 * import klear360Plugin from '@klearnow/klear360-svelte/configs/vite';
 *
 * export default defineConfig({ plugins: [klear360Plugin({ extra: './src/icons' })] });
 * ```
 */
declare function klear360Plugin(options?: Klear360PluginOptions): Plugin[];
export default klear360Plugin;
