import type { ReactNode } from 'react';
import type { ThemeTokens, ColorSchemeNamesInput } from '~tokens/theme';

type CompassProviderProps = {
  themeTokens: ThemeTokens;
  colorScheme?: ColorSchemeNamesInput;
  children: ReactNode;
};

export type { CompassProviderProps };
