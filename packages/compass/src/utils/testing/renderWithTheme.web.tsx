import type { RenderOptions, RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

const renderWithTheme = (ui: ReactElement, options: RenderOptions = {}): RenderResult =>
  render(
    <CompassProvider themeTokens={compassTheme} colorScheme="light">
      {ui}
    </CompassProvider>,
    options,
  );

export default renderWithTheme;
