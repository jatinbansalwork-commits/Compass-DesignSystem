// import original module declarations
import 'styled-components';
import 'styled-components/native';
import type { Theme } from '~components/CompassProvider';
import '@testing-library/jest-dom';
import '@testing-library/jest-native/extend-expect';

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}
declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends Theme {}
}

declare module 'react-virtualized-auto-sizer' {
  import type React from 'react';

  type AutoSizerRenderProps = { width: number; height: number };

  const AutoSizer: React.ComponentType<{
    children: (size: AutoSizerRenderProps) => React.ReactNode;
  }>;

  export default AutoSizer;
}
