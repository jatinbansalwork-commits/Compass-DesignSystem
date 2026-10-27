import type { GestureResponderEvent } from 'react-native';
import type React from 'react';
import type { BaseButtonProps } from '../BaseButton/baseButtonProps.types';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';
import type { CompassCommonEvents } from '~components/types';
import type { AriaRoles } from '~utils/makeAccessible';

export type ButtonCommonProps = {
  /**
   * When set on web, renders the control as a link (`a`) navigates to this URL.
   *
   * @default undefined
   */
  href?: BaseButtonProps['href'];
  /**
   * Target window for link-style buttons (`href` must be set).
   *
   * @default undefined
   */
  target?: BaseButtonProps['target'];
  /**
   * `rel` attribute for link-style buttons (`href` must be set).
   *
   * @default undefined
   */
  rel?: BaseButtonProps['rel'];
  /**
   * Sets visual emphasis: filled primary, outlined secondary, or minimal tertiary.
   *
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Sets the color intent using Compass feedback and brand tokens.
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'positive' | 'negative';
  /**
   * Sets height, padding, and typography scale for the button.
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Places the optional icon before or after the label.
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Prevents interaction and applies disabled styling.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Stretches the button to the full width of its container.
   *
   * @default false
   */
  isFullWidth?: boolean;
  /**
   * Shows a loading indicator and blocks repeated clicks while work is in progress.
   *
   * @default false
   */
  isLoading?: boolean;
  /**
   * Accessible name when the visible label is insufficient for screen readers.
   *
   * @default undefined
   */
  accessibilityLabel?: string;
  /**
   * Native button `type` when rendered as `button` (submit, reset, or button).
   *
   * @default 'button'
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * It is exposed for internal usage with tooltip.
   *
   * @private
   */
  'aria-describedby'?: string;
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  'aria-controls'?: string;
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  'aria-expanded'?: boolean;
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  'aria-haspopup'?: 'menu';
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  role?: AriaRoles;
  /**
   * Tab order when the button is focusable on web.
   *
   * @default undefined
   */
  tabIndex?: BaseButtonProps['tabIndex'];
  /**
   * Handler for press or click events on the button.
   *
   * @default undefined
   */
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
} & TestID &
  StyledPropsCompass &
  DataAnalyticsAttribute &
  CompassCommonEvents;

export type ButtonWithoutIconProps = ButtonCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

export type ButtonWithIconProps = ButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
};

export type ButtonProps = ButtonWithoutIconProps | ButtonWithIconProps;
