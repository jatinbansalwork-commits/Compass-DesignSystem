import type { ReactElement } from 'react';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext } from './useTheme';
import { useKdesignProvider } from './useKdesignProvider';
import type { KdesignProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const gestureHandlerStyle = {
  flex: 1,
};

const KdesignProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: KdesignProviderProps): ReactElement => {
  const { theme, themeContextValue } = useKdesignProvider({ initialColorScheme, themeTokens });

  return (
    <GestureHandlerRootView style={gestureHandlerStyle}>
      <PortalProvider>
        <ThemeContext.Provider value={themeContextValue}>
          <StyledComponentThemeProvider theme={theme}>
            <DrawerStackProvider>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
            </DrawerStackProvider>
            <PortalHost name="KdesignBottomSheetPortal" />
          </StyledComponentThemeProvider>
        </ThemeContext.Provider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

export { KdesignProvider };
