import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import klear360Plugin from './src/plugin/vite.js';

const dir = fileURLToPath(new URL('.', import.meta.url));
const bladeCoreRoot = resolve(dir, '../klear360-core/src');

// klear360-core is consumed as source (not built) during tests:
// - exact `@klearnow/klear360-core/*` entry points -> klear360-core source index files
// - klear360-core's internal `~utils` / `~tokens` / `~src` imports -> klear360-core source
// - `.web.ts` extension resolution so platform-split modules (elevation, fontFamily) resolve
const bladeCoreExtensions = [
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

const bladeCoreAlias = [
  {
    find: /^@razorpay\/klear360-core\/utils$/,
    replacement: resolve(bladeCoreRoot, 'utils/index.ts'),
  },
  {
    find: /^@razorpay\/klear360-core\/styles$/,
    replacement: resolve(bladeCoreRoot, 'styles/index.ts'),
  },
  {
    find: /^@razorpay\/klear360-core\/tokens$/,
    replacement: resolve(bladeCoreRoot, 'tokens/index.ts'),
  },
  { find: /^~utils(\/.*)?$/, replacement: resolve(bladeCoreRoot, 'utils$1') },
  { find: /^~tokens(\/.*)?$/, replacement: resolve(bladeCoreRoot, 'tokens$1') },
  { find: /^~src(\/.*)?$/, replacement: resolve(bladeCoreRoot, '$1') },
];

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: { compatibility: { componentApi: 4 } },
    }),
    // As an app builds them: icons are font glyphs. Icon's own tests cover
    // the no-plugin path (a URL drawn as a mask).
    ...klear360Plugin(),
  ],
  resolve: {
    conditions: ['browser'],
    dedupe: ['svelte'],
    alias: bladeCoreAlias,
    extensions: bladeCoreExtensions,
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
      // React parity target (packages/klear360/jest.web.config.js). These gate
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
