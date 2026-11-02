import type { ReactNode } from 'react';
import type { ThemeTokens, ColorSchemeNamesInput } from '~tokens/theme';

type CompassProviderProps = {
  /** Design tokens object (typically `compassTheme` from `@klearnow/compass/tokens`). */
  themeTokens: ThemeTokens;
  /** Initial color scheme; defaults to light when omitted. */
  colorScheme?: ColorSchemeNamesInput;
  /** App tree wrapped with theme, styled-components, and global Compass providers. */
  children: ReactNode;
};

export type { CompassProviderProps };
