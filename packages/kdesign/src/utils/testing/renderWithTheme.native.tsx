import type { RenderAPI, RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { KdesignProvider } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

const KdesignWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
    {children}
  </KdesignProvider>
);

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderAPI =>
  render(ui, { ...options, wrapper: KdesignWrapper });

export default renderWithTheme;
