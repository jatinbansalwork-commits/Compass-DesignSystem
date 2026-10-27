import type React from 'react';
import type { CSSProperties } from 'react';
import type { AccessibilityProps } from '~utils/makeAccessible/types';
import type { DataAnalyticsAttribute, TestID, ElementTiming } from '~utils/types';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { Theme } from '~components/CompassProvider';

type InteractiveText = DotNotationToken<Theme['colors']['interactive']['text']>;
type SurfaceText = DotNotationToken<Theme['colors']['surface']['text']>;
type FeedbackText = DotNotationToken<Theme['colors']['feedback']['text']>;
export type TextColors =
  | `interactive.text.${InteractiveText}`
  | `surface.text.${SurfaceText}`
  | `feedback.text.${FeedbackText}`;

type As =
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'abbr'
  | 'q'
  | 'cite'
  | 'figcaption'
  | 'div'
  | 'label';

export type BaseTextProps = {
  /**
   * Sets the DOM `id` attribute on web for associating labels or anchors.
   *
   * @default undefined
   */
  id?: string;
  /**
   * Sets the text color using a semantic token from the Compass theme, or `currentColor` to inherit from the parent.
   *
   * @default undefined
   */
  color?: TextColors | 'currentColor';
  /**
   * Selects the font family token from the theme typography scale.
   *
   * @default undefined
   */
  fontFamily?: keyof Theme['typography']['fonts']['family'];
  /**
   * Selects the font size step on the theme typography scale.
   *
   * @default undefined
   */
  fontSize?: keyof Theme['typography']['fonts']['size'];
  /**
   * Selects the font weight token (for example regular, medium, or semibold).
   *
   * @default undefined
   */
  fontWeight?: keyof Theme['typography']['fonts']['weight'];
  /**
   * Sets italic or normal font style.
   *
   * @default undefined
   */
  fontStyle?: 'italic' | 'normal';
  /**
   * Adds underline, strikethrough, or dotted decoration to the text.
   *
   * @default undefined
   */
  textDecorationLine?: 'line-through' | 'none' | 'underline' | 'dotted';
  /**
   * Transforms text casing (uppercase, lowercase, capitalize).
   *
   * @default undefined
   */
  textTransform?: CSSProperties['textTransform'];
  /**
   * Sets line height using a theme line-height token.
   *
   * @default undefined
   */
  lineHeight?: keyof Theme['typography']['lineHeights'];
  /**
   * Sets letter spacing using a theme letter-spacing token.
   *
   * @default undefined
   */
  letterSpacing?: keyof Theme['typography']['letterSpacings'];
  /**
   * Controls how words break when wrapping in narrow layouts.
   *
   * @default undefined
   */
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  /**
   * Sets text opacity between 0 and 1.
   *
   * @default undefined
   */
  opacity?: number;
  /**
   * Sets the semantic HTML element rendered on web (headings, paragraph, span, and similar).
   *
   * @default undefined
   */
  as?: As;
  /**
   * Aligns text within its container on web.
   *
   * @default undefined
   */
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  /**
   * Limits visible lines and truncates overflow with an ellipsis on web.
   *
   * @default undefined
   */
  truncateAfterLines?: number;
  /**
   * Optional CSS class name applied on web for custom styling hooks.
   *
   * @default undefined
   */
  className?: string;
  /**
   * Inline style object applied on web when token props are not sufficient.
   *
   * @default undefined
   */
  style?: React.CSSProperties;
  /**
   * Text or inline elements rendered as children.
   */
  children: React.ReactNode;
  /**
   * Additional ARIA attributes merged into the accessible text node.
   *
   * @default undefined
   */
  accessibilityProps?: Partial<AccessibilityProps>;
  /**
   * On React Native, limits the number of lines before truncating with an ellipsis.
   *
   * @default undefined
   */
  numberOfLines?: number;
  /**
   * Internal metric identifier for which typography primitive is rendering.
   *
   * @default undefined
   */
  componentName?: 'base-text' | 'text' | 'title' | 'heading' | 'code' | 'display';
} & TestID &
  ElementTiming &
  DataAnalyticsAttribute &
  StyledPropsCompass;

export type StyledBaseTextProps = Pick<
  BaseTextProps,
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'fontStyle'
  | 'textDecorationLine'
  | 'lineHeight'
  | 'letterSpacing'
  | 'as'
  | 'textAlign'
  | 'numberOfLines'
  | 'truncateAfterLines'
  | 'wordBreak'
  | 'opacity'
  | 'textTransform'
> & { theme: Theme };

export type BaseTextSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
