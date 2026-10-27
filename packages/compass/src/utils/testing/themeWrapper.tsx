import type { ReactElement } from 'react';
import { CompassProvider } from '~components/CompassProvider';
import { compassTheme } from '~tokens/theme';

const themeWrapper = ({ children }: { children: ReactElement }): ReactElement => (
  <CompassProvider themeTokens={compassTheme} colorScheme="light">
    {children}
  </CompassProvider>
);

export default themeWrapper;
