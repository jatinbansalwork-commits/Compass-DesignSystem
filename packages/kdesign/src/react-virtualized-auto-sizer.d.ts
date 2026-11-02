declare module 'react-virtualized-auto-sizer' {
  import type React from 'react';

  type AutoSizerRenderProps = { width: number; height: number };

  const AutoSizer: React.ComponentType<{
    children: (size: AutoSizerRenderProps) => React.ReactNode;
  }>;

  export default AutoSizer;
}
