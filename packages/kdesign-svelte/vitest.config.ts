import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import kdesignPlugin from './src/plugin/vite.js';

const dir = fileURLToPath(new URL('.', import.meta.url));
const kdesignCoreRoot = resolve(dir, '../kdesign-core/src');

// kdesign-core is consumed as source (not built) during tests:
// - exact `@klearnow/kdesign-core/*` entry points -> kdesign-core source index files
// - kdesign-core's internal `~utils` / `~tokens` / `~src` imports -> kdesign-core source
// - `.web.ts` extension resolution so platform-split modules (elevation, fontFamily) resolve
const kdesignCoreExtensions = [
  '.web.ts',
  '.web.tsx',
  '.web.js',
  '.mjs',
  '.js',
  '.mts',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
];

const kdesignCoreAlias = [
  {
    find: /^@razorpay\/kdesign-core\/utils$/,
    replacement: resolve(kdesignCoreRoot, 'utils/index.ts'),
  },
  {
    find: /^@razorpay\/kdesign-core\/styles$/,
    replacement: resolve(kdesignCoreRoot, 'styles/index.ts'),
  },
  {
    find: /^@razorpay\/kdesign-core\/tokens$/,
    replacement: resolve(kdesignCoreRoot, 'tokens/index.ts'),
  },
  { find: /^~utils(\/.*)?$/, replacement: resolve(kdesignCoreRoot, 'utils$1') },
  { find: /^~tokens(\/.*)?$/, replacement: resolve(kdesignCoreRoot, 'tokens$1') },
  { find: /^~src(\/.*)?$/, replacement: resolve(kdesignCoreRoot, '$1') },
];

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: { compatibility: { componentApi: 4 } },
    }),
    // As an app builds them: icons are font glyphs. Icon's own tests cover
    // the no-plugin path (a URL drawn as a mask).
    ...kdesignPlugin(),
  ],
  resolve: {
    conditions: ['browser'],
    dedupe: ['svelte'],
    alias: kdesignCoreAlias,
    extensions: kdesignCoreExtensions,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // Some tests import a component on first use, which can pass Vitest's
    // 5s default.
    testTimeout: 15_000,
    // `scripts/`: the icon extractor the icon pipeline runs.
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{svelte,ts}'],
      exclude: ['src/stories/**', 'src/test/**', '**/*.test.ts', '**/index.ts', '**/*.d.ts'],
      // React parity target (packages/kdesign/jest.web.config.js). These gate
      // `test:coverage` only; CI runs `yarn test` (non-gating) while coverage ramps up.
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
    },
  },
});
