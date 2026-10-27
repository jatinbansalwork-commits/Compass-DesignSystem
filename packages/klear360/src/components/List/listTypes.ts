import type React from 'react';
import type { IconComponent, IconProps } from '~components/Icons';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';
type ListCommonProps = {
  /**
   * ListItem to be rendered for the List.
   *
   */
  children: React.ReactElement | React.ReactElement[];
  /**
   * Sets the variant to be rendered for the List.
   *
   * @default 'unordered'
   */
  variant?: 'unordered' | 'ordered' | 'ordered-filled';
  /**
   * Sets the size for the List.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  StyledPropsKlear360;

type ListWithIconProps = ListCommonProps & {
  variant?: 'unordered';
  /**
   * Icon rendered beside each list item for unordered lists.
   *
   * @default undefined
   */
  icon?: IconComponent;
  /**
   * Sets the list marker icon color using Klear360 icon semantic tokens.
   *
   * @default undefined
   */
  iconColor?: IconProps['color'];
};
type ListWithoutIconProps = ListCommonProps & {
  variant?: 'ordered' | 'ordered-filled';
  icon?: undefined;
  iconColor?: undefined;
};
export type ListProps = ListWithIconProps | ListWithoutIconProps;
