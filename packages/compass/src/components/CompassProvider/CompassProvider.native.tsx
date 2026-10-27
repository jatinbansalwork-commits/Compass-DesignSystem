import type { ReactElement } from 'react';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { PortalHost, PortalProvider } from '@gorhom/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeContext } from './useTheme';
import { useCompassProvider } from './useCompassProvider';
import type { CompassProviderProps } from './types';
import { BottomSheetStackProvider } from '~components/BottomSheet/BottomSheetStack';
import { DrawerStackProvider } from '~components/Drawer/StackProvider';

const gestureHandlerStyle = {
  flex: 1,
};

const CompassProvider = ({
  themeTokens,
  colorScheme: initialColorScheme,
  children,
}: CompassProviderProps): ReactElement => {
  const { theme, themeContextValue } = useCompassProvider({ initialColorScheme, themeTokens });

  return (
    <GestureHandlerRootView style={gestureHandlerStyle}>
      <PortalProvider>
        <ThemeContext.Provider value={themeContextValue}>
          <StyledComponentThemeProvider theme={theme}>
            <DrawerStackProvider>
              <BottomSheetStackProvider>{children}</BottomSheetStackProvider>
            </DrawerStackProvider>
            <PortalHost name="CompassBottomSheetPortal" />
          </StyledComponentThemeProvider>
        </ThemeContext.Provider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

export { CompassProvider };
