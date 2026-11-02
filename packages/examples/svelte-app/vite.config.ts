import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnoCSS from 'unocss/vite';
import kdesignPlugin from '@klearnow/kdesign-svelte/configs/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // Icons stay SVG imports in your code; the plugin turns Kdesign's (and
    // yours, with `extra`) into glyphs of one font holding only those used.
    kdesignPlugin(),
    // Kdesign's classes, and yours, in one pass (uno.config.ts).
    UnoCSS(),
    svelte(),
    // `npm run analyze`: dist/stats.html, what each module costs.
    process.env.ANALYZE && visualizer({ filename: 'dist/stats.html', gzipSize: true, open: false }),
  ],
  // The package is linked from the monorepo: one Svelte runtime, the app's.
  resolve: { dedupe: ['svelte'] },
});
