import type { ReactElement } from 'react';
import {
  ThemeProvider as StyledComponentThemeProvider,
  StyleSheetManager,
} from 'styled-components';
import { FloatingDelayGroup } from '@floating-ui/react';
import stylisCSSHigherSpecificity from './stylisCSSHigherSpecificity';
import { ThemeContext } from './useTheme';
import { useKdesignProvider } from './useKdesignProvider';
import type { KdesignProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const tooltipDelays = { open: 300, close: 300 };

const KdesignProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: KdesignProviderProps): ReactElement => {
  const { theme, themeContextValue } = useKdesignProvider({ initialColorScheme, themeTokens });

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <FloatingDelayGroup delay={tooltipDelays}>
        <StyledComponentThemeProvider theme={theme}>
          <StyleSheetManager stylisPlugins={[stylisCSSHigherSpecificity()]}>
            {/* 
              If you want to add a new provider for keeping track of stack in component,
              You can move DrawerStackProvider to common utils and rename to GlobalStackProvider
              and reuse it for your component.
            */}
            <DrawerStackProvider>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
            </DrawerStackProvider>
          </StyleSheetManager>
        </StyledComponentThemeProvider>
      </FloatingDelayGroup>
    </ThemeContext.Provider>
  );
};

export { KdesignProvider };
