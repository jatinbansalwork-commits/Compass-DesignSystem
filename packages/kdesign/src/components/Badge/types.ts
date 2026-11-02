import type { IconComponent } from '~components/Icons';
import type { StyledPropsKdesign } from '~components/Box/styledProps';
import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';
import type { Theme } from '~components/KdesignProvider';
import type { DotNotationColorStringToken } from '~utils/types';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';

type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

export type BadgeProps = {
  /**
   * Sets the label for the badge.
   */
  children: StringChildrenType;
  /**
   * Sets the color of the badge.
   *
   * @default 'neutral'
   */
  color?: FeedbackColors | 'primary';
  /**
   * Sets the contrast of the badge.
   *
   * @default 'subtle'
   */
  emphasis?: SubtleOrIntense;
  /**
   * Sets the size of the badge.
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * Icon to be displayed in the badge.
   * Accepts a component of type `IconComponent` from Kdesign.
   */
  icon?: IconComponent;
} & TestID &
  StyledPropsKdesign &
  DataAnalyticsAttribute;

export type StyledBadgeProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<BadgeProps['size']>;
  theme: Theme;
};
