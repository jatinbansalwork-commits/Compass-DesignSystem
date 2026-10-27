import type React from 'react';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { TestID, ElementTiming } from '~utils/types';

export const validHeadingAsValues = ['span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

export type HeadingProps = {
  /**
   * Sets the semantic heading level rendered on web (`h1`–`h6` or `span`).
   * When omitted, size maps to a default heading level.
   *
   * @default undefined
   */
  as?: typeof validHeadingAsValues[number];
  /**
   * Sets the text color using a semantic token from the Compass theme.
   * Overrides size- and weight-driven color defaults when provided.
   *
   * @default undefined
   */
  color?: BaseTextProps['color'];
  /**
   * Sets the font weight for the heading using theme typography weights.
   *
   * @default 'semibold'
   */
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
  /**
   * Heading copy or inline elements to render.
   */
  children: React.ReactNode;
  /**
   * Aligns the heading text within its layout box on web.
   *
   * @default undefined
   */
  textAlign?: BaseTextProps['textAlign'];
  /**
   * Adds underline or strikethrough emphasis to the heading.
   *
   * @default undefined
   */
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  /**
   * Sets the heading size on the Compass display type scale.
   *
   * @default undefined
   */
  size?: Extract<BaseTextSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
  /**
   * Transforms heading casing (for example uppercase section titles).
   *
   * @default undefined
   */
  textTransform?: BaseTextProps['textTransform'];
  /**
   * Controls word breaking when headings wrap in narrow layouts.
   *
   * @default undefined
   */
  wordBreak?: BaseTextProps['wordBreak'];
} & TestID &
  ElementTiming &
  StyledPropsCompass;
