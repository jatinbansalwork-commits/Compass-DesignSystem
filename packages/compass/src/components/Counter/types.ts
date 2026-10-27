import type { Theme } from '~components/CompassProvider';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { TypographyPlatforms } from '~tokens/global';
import type { DotNotationColorStringToken, DataAnalyticsAttribute, TestID } from '~utils/types';
import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';

export type CounterProps = {
  /** Sets the value for the counter. */
  value: number;
  /** Sets the max value for the counter. If value exceedes `max` it will render `value+` */
  max?: number;
  /** Sets the color of the counter. @default 'neutral' */
  color?: FeedbackColors | 'primary';
  /** Sets the contrast of the counter. @default 'subtle' */
  emphasis?: SubtleOrIntense;
  /** Sets the size of the counter. @default 'medium' */
  size?: 'small' | 'medium' | 'large';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsCompass;

type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<
  Theme['colors']['feedback']['background']
>}`;

type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;

export type StyledCounterProps = {
  backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
  size: NonNullable<CounterProps['size']>;
  platform: TypographyPlatforms;
  theme: Theme;
};
