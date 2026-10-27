export const surfaceTextNormal = 'hsla(210, 16%, 15%, 1)';
export const bladePrimary = 'hsla(198, 100%, 18%, 1)';
export const bladeTextFont =
  '"Inter", -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif';
export const bladeCodeFont = '"Menlo", San Francisco Mono, Courier New, Roboto Mono, monospace';

import { getColorScheme } from '../../src/utils/getColorScheme/getColorScheme.web';
import type { ColorSchemeNamesInput } from '../../src/tokens/theme';

const sharedTheme = {
  colorPrimary: bladePrimary,
  colorSecondary: bladePrimary,
  fontBase: bladeTextFont,
  fontCode: bladeCodeFont,
  appBorderRadius: 4,
  inputBorderRadius: 2,
  brandTitle: 'Compass',
  brandUrl: undefined,
  brandImage: null,
  brandTarget: '_self',
};

export const lightThemeConfig = {
  ...sharedTheme,
  base: 'light' as const,

  // UI
  appBg: '#F7F8FA',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.02)',

  // Text colors
  textColor: surfaceTextNormal,
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',

  // Toolbar default and active colors
  barTextColor: surfaceTextNormal,
  barSelectedColor: bladePrimary,
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.1)',
  inputTextColor: surfaceTextNormal,
};

export const darkThemeConfig = {
  ...sharedTheme,
  base: 'dark' as const,
  appBg: '#0E1218',
  appContentBg: '#161C24',
  appBorderColor: 'rgba(255,255,255,.08)',
  textColor: 'hsla(210, 16%, 92%, 1)',
  textInverseColor: surfaceTextNormal,
  textMutedColor: 'hsla(210, 10%, 65%, 1)',
  barTextColor: 'hsla(210, 16%, 92%, 1)',
  barSelectedColor: '#7EB8FF',
  barBg: '#161C24',
  inputBg: '#1C2430',
  inputBorder: 'rgba(255,255,255,.12)',
  inputTextColor: 'hsla(210, 16%, 92%, 1)',
};

/** @deprecated Use lightThemeConfig or getStorybookTheme() */
export const themeConfig = lightThemeConfig;

export const getStorybookTheme = (colorScheme: ColorSchemeNamesInput = 'light') => {
  const resolved = getColorScheme(colorScheme);
  return resolved === 'dark' ? darkThemeConfig : lightThemeConfig;
};
