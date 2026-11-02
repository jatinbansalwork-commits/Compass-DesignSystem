import type { ReactElement } from 'react';
import { KdesignProvider } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

const themeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <KdesignProvider themeTokens={kdesignTheme} colorScheme="light">
    {children}
  </KdesignProvider>
);

export default themeWrapper;
