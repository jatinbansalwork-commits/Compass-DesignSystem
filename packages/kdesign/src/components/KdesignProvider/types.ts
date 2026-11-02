import type { ReactNode } from 'react';
import type { ThemeTokens, ColorSchemeNamesInput } from '~tokens/theme';

type KdesignProviderProps = {
  /** Design tokens object (typically `kdesignTheme` from `@klearnow/kdesign/tokens`). */
  themeTokens: ThemeTokens;
  /** Initial color scheme; defaults to light when omitted. */
  colorScheme?: ColorSchemeNamesInput;
  /** App tree wrapped with theme, styled-components, and global Kdesign providers. */
  children: ReactNode;
};

export type { KdesignProviderProps };
