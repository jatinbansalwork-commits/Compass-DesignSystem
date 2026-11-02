import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { KdesignProvider } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderResult =>
  render(
    <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
      {ui}
    </KdesignProvider>,
    options,
  );

export default renderWithTheme;
