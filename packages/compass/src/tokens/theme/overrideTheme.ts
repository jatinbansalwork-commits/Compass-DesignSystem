import compassTheme from './compassTheme';
import type { ThemeTokens } from './theme';
import merge from '~utils/lodashButBetter/merge';
import cloneDeep from '~utils/lodashButBetter/cloneDeep';
import { hasSameObjectStructure } from '~utils/hasSameObjectStructure';
import type { ObjectWithKeys } from '~utils/hasSameObjectStructure';
import { isPartialMatchObjectKeys } from '~utils/isPartialMatchObjectKeys';
import type { DeepPartial } from '~utils/isPartialMatchObjectKeys';
import { throwCompassError } from '~utils/logger';

type OverrideTheme = {
  /**
   * base tokens
   */
  baseThemeTokens: ThemeTokens;
  /**
   * partial theme tokens
   */
  overrides: DeepPartial<ThemeTokens>;
};

/**
 * @deprecated Use `createTheme` from `@klearnow/compass/tokens` instead
 *
 * @description
 *
 * `overrideTheme` merges the `baseThemeTokens` and `overrides` and returns a new ThemeTokens object,
 * which you can pass into CompassProvider.
 *
 * @example
 * ```tsx
 * const customTheme = overrideTheme({
 *   baseThemeTokens: compassTheme, // theme to override
 *   overrides: {
 *     colors: {
 *       onLight: {
 *         brand: {
 *           primary: {
 *             '500': 'hsla(222, 100%, 96%, 1)',
 *           },
 *         },
 *       },
 *     },
 *   },
 * });
 *
 * <CompassProvider themeTokens={customTheme} />
 * ```
 */
const overrideTheme = ({ baseThemeTokens, overrides }: OverrideTheme): ThemeTokens => {
  if (__DEV__) {
    if (
      !hasSameObjectStructure(
        (baseThemeTokens as unknown) as ObjectWithKeys,
        (compassTheme as unknown) as ObjectWithKeys,
      )
    ) {
      throwCompassError({
        message: 'The base theme provided is not a valid Compass theme',
        moduleName: 'overrideTheme',
      });
    }

    if (
      !isPartialMatchObjectKeys<ThemeTokens>({
        objectToMatch: overrides,
        objectToInspect: baseThemeTokens,
      })
    ) {
      throwCompassError({
        message: 'The overrides object is not valid',
        moduleName: 'overrideTheme',
      });
    }
  }

  // Need to clone before merging since merge changes/mutates the actual object
  return merge(cloneDeep(baseThemeTokens), overrides) as ThemeTokens;
};

export default overrideTheme;
