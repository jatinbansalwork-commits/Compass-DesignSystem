/**
 * Kdesign's icons, named as in Kdesign React: pass one to any `icon`/`source`
 * prop.
 *
 * ```svelte
 * <script>
 *   import { Alert } from '@klearnow/kdesign-svelte/components';
 *   import { WalletIcon } from '@klearnow/kdesign-svelte/icons';
 * </script>
 *
 * <Alert icon={WalletIcon} description="Pay with your wallet balance" />
 * ```
 *
 * Each icon is its SVG file: a URL, drawn as a mask. With `kdesignPlugin`
 * (`@klearnow/kdesign-svelte/configs/vite` or `/configs/webpack`) in the build, it is a glyph of
 * a font holding exactly the icons the app imports.
 */
export * from './glyphs.js';
export type { KdesignIconName } from './names';
export type { IconSource, Glyph } from '../runes/icon/source';
