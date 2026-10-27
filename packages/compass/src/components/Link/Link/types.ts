import type { SyntheticEvent } from 'react';
import type { BaseLinkProps } from '../BaseLink';
import type { IconComponent } from '~components/Icons';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { StringChildrenType, TestID, DataAnalyticsAttribute } from '~utils/types';
import type { Platform } from '~utils';
import type { CompassCommonEvents } from '~components/types';

export type LinkCommonProps = {
  /**
   * Renders as a text link (`anchor`) or as a button-styled control (`button`).
   *
   * @default 'anchor'
   */
  variant?: 'anchor' | 'button';
  /**
   * Optional icon shown beside the link label.
   *
   * @default undefined
   */
  icon?: IconComponent;
  /**
   * Sets the link color using Compass semantic color intents.
   *
   * @default 'primary'
   */
  color?: 'primary' | 'white' | 'neutral' | 'negative' | 'positive';
  /**
   * Places the icon before or after the label when `icon` is set.
   *
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
  /**
   * Disables interaction for button-variant links.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Handler invoked when the link is pressed or clicked.
   *
   * @default undefined
   */
  onClick?: (event: SyntheticEvent) => void;
  /**
   * Destination URL when `variant` is `anchor` on web.
   *
   * @default undefined
   */
  href?: string;
  /**
   * Target browsing context for anchor links (for example `_blank`).
   *
   * @default undefined
   */
  target?: string;
  /**
   * Accessible name when the visible label is not descriptive enough.
   *
   * @default undefined
   */
  accessibilityLabel?: string;
  /**
   * Sets typography and tap target size to match adjacent text or buttons.
   *
   * @default 'medium'
   */
  size?: BaseLinkProps['size'];
  /**
   * It is exposed for internal usage with tooltip.
   *
   * @private
   */
  'aria-describedby'?: string;
} & TestID &
  StyledPropsCompass &
  CompassCommonEvents &
  Platform.Select<{
    native: {
      /**
       * Expands the touchable area beyond the visible link bounds on native.
       *
       * @default undefined
       */
      hitSlop?:
        | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
          }
        | number;
      /**
       * This is a web only prop and has no effect on react-native.
       */
      htmlTitle?: undefined;
    };
    web: {
      /**
       * This is a react-native only prop and has no effect on web.
       */
      hitSlop?: undefined;
      /**
       * Native browser tooltip text shown on hover for anchor links.
       *
       * @default undefined
       */
      htmlTitle?: string;
    };
  }>;

export type LinkWithoutIconProps = LinkCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

export type LinkWithIconProps = LinkCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
};

type LinkPropsWithOrWithoutIcon = LinkWithIconProps | LinkWithoutIconProps;

export type LinkAnchorVariantProps = LinkPropsWithOrWithoutIcon & {
  variant?: 'anchor';
  href?: string;
  target?: string;
  rel?: string;
  isDisabled?: undefined;
} & DataAnalyticsAttribute;

export type LinkButtonVariantProps = LinkPropsWithOrWithoutIcon & {
  variant?: 'button';
  isDisabled?: boolean;
  href?: undefined;
  target?: undefined;
  rel?: undefined;
} & DataAnalyticsAttribute;

export type LinkProps = LinkAnchorVariantProps | LinkButtonVariantProps;
