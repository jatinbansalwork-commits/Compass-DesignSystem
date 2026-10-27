import { useContext, createContext } from 'react';
import type { Theme } from './themeTypes';
import type { ThemeTokens } from '~tokens/theme';
import type { UseColorScheme } from '~utils/useColorScheme';
import type { TypographyPlatforms } from '~tokens/global';
import { throwCompassError } from '~utils/logger';

export type ThemeContext = UseColorScheme & {
  theme: Theme;
  themeTokens: ThemeTokens;
  platform: TypographyPlatforms;
};

export const ThemeContext = createContext<ThemeContext>({
  // @ts-expect-error set null
  theme: null,
  // @ts-expect-error set null
  themeTokens: null,
  colorScheme: 'light',
  platform: 'onDesktop',
  setColorScheme: () => null,
});

const useTheme = (): ThemeContext => {
  const themeContext = useContext<ThemeContext>(ThemeContext);
  if (__DEV__) {
    if (!themeContext.theme) {
      throwCompassError({
        message: 'CompassProvider is missing theme',
        moduleName: 'CompassProvider',
      });
    }
    if (themeContext === undefined) {
      throwCompassError({
        message: 'useTheme must be used within CompassProvider',
        moduleName: 'CompassProvider',
      });
    }
  }
  return themeContext;
};

export default useTheme;
