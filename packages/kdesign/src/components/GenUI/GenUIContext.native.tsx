/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { GenUIAction } from './types';
import { throwKdesignError } from '~utils/logger';

type GenUIContextValue = any;
const GenUIContext = React.createContext<GenUIContextValue | null>(null);

/**
 * Hook to access GenUI context
 * @throws Error if used outside GenUIProvider
 */
const useGenUI = (): GenUIContextValue => {
  throwKdesignError({
    message: 'useGenUI is not yet implemented for React Native',
    moduleName: 'useGenUI',
  });
  return null;
};

/**
 * Hook to access action click handler (safe version that doesn't throw)
 */
const useGenUIAction = (): ((action: GenUIAction) => void) | undefined => {
  throwKdesignError({
    message: 'useGenUIAction is not yet implemented for React Native',
    moduleName: 'useGenUIAction',
  });
  return undefined;
};

/**
 * Hook to access the consumer-registered action slot registry (safe version that doesn't throw)
 */
const useGenUIComponentActions = (): undefined => {
  throwKdesignError({
    message: 'useGenUIComponentActions is not yet implemented for React Native',
    moduleName: 'useGenUIComponentActions',
  });
  return undefined;
};

export { GenUIContext, useGenUI, useGenUIAction, useGenUIComponentActions };
export type { GenUIContextValue };
