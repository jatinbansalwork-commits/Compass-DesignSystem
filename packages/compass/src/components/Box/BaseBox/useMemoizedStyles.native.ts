import type { CSSObject } from 'styled-components';
import { getBaseBoxStyles } from './baseBoxStyles';
import type { BaseBoxProps, StyledPropsCompass } from './types';
import type { Theme } from '~components/CompassProvider';

const getMemoDependency = (props: BaseBoxProps & { theme?: Theme }): string | BaseBoxProps => {
  // Doesn't do anything on react native. It's not even called on react native. checkout web implementation
  return props;
};

const useMemoizedStyles = (
  boxProps: (BaseBoxProps | StyledPropsCompass) & { theme: Theme },
): CSSObject => {
  // This doesn't do anything special on native. The function is primarily for web.
  return getBaseBoxStyles({ ...boxProps, theme: boxProps.theme });
};

export { useMemoizedStyles, getMemoDependency };
