import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { FlexboxProps } from '~components/Box/BaseBox/types/propsTypes';
import type { StyledPropsKdesign } from '~components/Box/styledProps';

type SkeletonProps = StyledPropsKdesign &
  Pick<
    BaseBoxProps,
    'width' | 'maxWidth' | 'minWidth' | 'height' | 'maxHeight' | 'minHeight' | 'borderRadius'
  > &
  Partial<FlexboxProps> & {
    /** Test identifier for the skeleton root. */
    testID?: string;
  };

export type { SkeletonProps };
