import type { RenderAPI, RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

const CompassWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <CompassProvider themeTokens={compassTheme} colorScheme="light">
    {children}
  </CompassProvider>
);

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderAPI =>
  render(ui, { ...options, wrapper: CompassWrapper });

export default renderWithTheme;
