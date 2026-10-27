/**
 * Klear360's icons, named as in Klear360 React: pass one to any `icon`/`source`
 * prop.
 *
 * ```svelte
 * <script>
 *   import { Alert } from '@klearnow/klear360-svelte/components';
 *   import { WalletIcon } from '@klearnow/klear360-svelte/icons';
 * </script>
 *
 * <Alert icon={WalletIcon} description="Pay with your wallet balance" />
 * ```
 *
 * Each icon is its SVG file: a URL, drawn as a mask. With `klear360Plugin`
 * (`@klearnow/klear360-svelte/configs/vite` or `/configs/webpack`) in the build, it is a glyph of
 * a font holding exactly the icons the app imports.
 */
export * from './glyphs.js';
export type { Klear360IconName } from './names';
export type { IconSource, Glyph } from '../runes/icon/source';
