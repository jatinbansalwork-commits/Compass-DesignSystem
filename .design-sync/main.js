import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const kdesignRoot = resolve(__dirname, '../packages/kdesign');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: StorybookConfig = {
  typescript: {
    check: !isDevelopment,
    checkOptions: {
      typescript: {
        configFile: resolve(kdesignRoot, 'tsconfig-typecheck.web.json'),
      },
    },
    reactDocgen: isDevelopment ? false : 'react-docgen-typescript',
  },

  refs: {
    '@storybook/design-system': { disable: true },
  },

  stories: [
    '../../packages/kdesign/docs/**/*.mdx',
    '../../packages/kdesign/docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../packages/kdesign/src/**/*.mdx',
    '../../packages/kdesign/src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../packages/kdesign/src/**/*.internal.stories.@(ts|tsx|js|jsx)',
  ],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),

  staticDirs: ['../../packages/kdesign/public'],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
    const react = (await import('@vitejs/plugin-react')).default;

    return mergeConfig(config, {
      plugins: [
        react(),
        tsconfigPaths({
          root: kdesignRoot,
        }),
      ],
      define: {
        __DEV__: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      resolve: {
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.tsx',
          '.ts',
          '.web.js',
          '.mjs',
          '.js',
          '.jsx',
          '.json',
        ],
        alias: {
          '~utils': resolve(kdesignRoot, 'src/utils'),
          '~components': resolve(kdesignRoot, 'src/components'),
          '~tokens': resolve(kdesignRoot, 'src/tokens'),
          '~src': resolve(kdesignRoot, 'src'),
        },
      },
    });
  },
};

export default config;
