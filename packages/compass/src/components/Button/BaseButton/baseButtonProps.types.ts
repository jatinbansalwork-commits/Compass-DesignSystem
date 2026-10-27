import type React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { CompassCommonEvents } from '~components/types';
import type { IconComponent } from '~components/Icons';
import type { BaseLinkProps } from '~components/Link/BaseLink';
import type { Theme } from '~components/CompassProvider';
import type { IconSize } from '~components/Icons';
import type { BaseSpinnerProps } from '~components/Spinner/BaseSpinner';
import type { AccessibilityProps } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';
import type { Platform } from '~utils';

export type BaseButtonCommonProps = {
  href?: BaseLinkProps['href'];
  target?: BaseLinkProps['target'];
  rel?: BaseLinkProps['rel'];
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  id?: string;
  tabIndex?: BaseBoxProps['tabIndex'];
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onKeyDown?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  }>;
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
  type?: 'button' | 'reset' | 'submit';
  isLoading?: boolean;
  accessibilityProps?: Partial<AccessibilityProps>;
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?:
    | 'primary'
    | 'white'
    | 'positive'
    | 'negative'
    | 'notice'
    | 'information'
    | 'neutral'
    | 'transparent';
  /**
   * Overrides the size-derived border radius. Used by FloatingActionButton to
   * render a pill. `round` is excluded because a percentage radius distorts on
   * a non-square button.
   */
  _borderRadius?: Exclude<keyof Theme['border']['radius'], 'round'>;
  /**
   * Overrides the size-derived icon size. Used by FloatingActionButton, whose
   * icon is larger than a `size="large"` Button's.
   */
  _iconSize?: IconSize;
  /**
   * Overrides the color of the loading indicator. Used by FloatingActionButton,
   * whose contrast requirements differ from `Button`'s.
   */
  _spinnerColor?: BaseSpinnerProps['color'];
} & TestID &
  StyledPropsCompass &
  CompassCommonEvents;

/*
Mandatory children prop when icon is not provided
*/
type BaseButtonWithoutIconProps = BaseButtonCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
} & DataAnalyticsAttribute;

/*
 Optional children prop when icon is provided
*/
type BaseButtonWithIconProps = BaseButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
} & DataAnalyticsAttribute;

/*
 With or without icon prop. We need at least an icon or a children prop present.
*/
export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;
