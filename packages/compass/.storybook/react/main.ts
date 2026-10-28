import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';
import type { Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const bladeRoot = resolve(__dirname, '../../');
const monorepoRoot = resolve(bladeRoot, '../..');

const resolvePackageRoot = (name: string): string => {
  const candidates = [name, name.replace('@klearnow/', '@razorpay/')];
  for (const pkg of candidates) {
    try {
      return dirname(require.resolve(pkg, { paths: [bladeRoot, monorepoRoot] }));
    } catch {
      /* try next */
    }
  }
  const local = join(bladeRoot, 'node_modules', ...name.split('/'));
  return local;
};

const i18nifyJsRoot = join(bladeRoot, 'node_modules/@klearnow/i18nify-js');
const i18nifyReactRoot = join(bladeRoot, 'node_modules/@klearnow/i18nify-react');

const compassI18nifyAlias = (): Plugin => ({
  name: 'compass-i18nify-alias',
  resolveId(source) {
    if (source === '@klearnow/i18nify-js/currency') {
      return join(i18nifyJsRoot, 'lib/esm/currency/index.js');
    }
    if (source === '@klearnow/i18nify-js') {
      return join(i18nifyJsRoot, 'lib/esm/index.js');
    }
    if (source === '@klearnow/i18nify-react') {
      return join(i18nifyReactRoot, 'lib/esm/index.js');
    }
    return null;
  },
});

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: StorybookConfig = {
  typescript: {
    check: !isDevelopment,
    checkOptions: {
      typescript: {
        configFile: resolve(bladeRoot, 'tsconfig-typecheck.web.json'),
      },
    },
    reactDocgen: isDevelopment ? false : 'react-docgen-typescript',
  },

  refs: {
    '@storybook/design-system': { disable: true },
  },

  stories: [
    '../../docs/**/*.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.internal.stories.@(ts|tsx|js|jsx)',
    '!../../src/storybook-recipes/**/*.stories.@(ts|tsx|js|jsx)',
  ],

  addons: [getAbsolutePath('@storybook/addon-docs'), getAbsolutePath('@storybook/addon-a11y')],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),

  // '../../assets' is served at /assets so stories can point RazorSense's
  // assetsPath at the local (unpublished) spark assets via "/assets/spark".
  staticDirs: ['../../public', { from: '../../assets', to: '/assets' }],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
    const react = (await import('@vitejs/plugin-react')).default;

    return mergeConfig(config, {
      server: {
        allowedHosts: ['localhost', '127.0.0.1'],
      },
      plugins: [
        compassI18nifyAlias(),
        react(),
        tsconfigPaths({
          root: bladeRoot,
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
        alias: [
          { find: /^~utils\/(.*)/, replacement: `${resolve(bladeRoot, 'src/utils')}/$1` },
          { find: /^~components\/(.*)/, replacement: `${resolve(bladeRoot, 'src/components')}/$1` },
          { find: /^~tokens\/(.*)/, replacement: `${resolve(bladeRoot, 'src/tokens')}/$1` },
          { find: /^~src\/(.*)/, replacement: `${resolve(bladeRoot, 'src')}/$1` },
          { find: '~utils', replacement: resolve(bladeRoot, 'src/utils') },
          { find: '~components', replacement: resolve(bladeRoot, 'src/components') },
          { find: '~tokens', replacement: resolve(bladeRoot, 'src/tokens') },
          { find: '~src', replacement: resolve(bladeRoot, 'src') },
          {
            find: '@klearnow/i18nify-js/currency',
            replacement: join(i18nifyJsRoot, 'lib/esm/currency/index.js'),
          },
          {
            find: '@klearnow/i18nify-js',
            replacement: join(i18nifyJsRoot, 'lib/esm/index.js'),
          },
          {
            find: '@klearnow/i18nify-react',
            replacement: join(i18nifyReactRoot, 'lib/esm/index.js'),
          },
        ],
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
