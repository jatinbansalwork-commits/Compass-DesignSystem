/// <reference types="vite/client" />

import { Theme } from '@klearnow/compass/components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
