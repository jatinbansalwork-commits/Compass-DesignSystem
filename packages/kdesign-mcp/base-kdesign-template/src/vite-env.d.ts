/// <reference types="vite/client" />

import { Theme } from '@klearnow/kdesign/components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
