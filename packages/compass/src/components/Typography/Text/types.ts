import type React from 'react';
import type { BaseTextProps, BaseTextSizes } from '../BaseText/types';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { TestID, ElementTiming } from '~utils/types';

export const validAsValues = [
  'p',
  'span',
  'div',
  'abbr',
  'figcaption',
  'cite',
  'q',
  'label',
] as const;

export type TextVariant = 'body' | 'caption';

export type TextCommonProps = {
  /**
   * Sets the semantic HTML element rendered on web (for example `p` for paragraphs).
   * React Native always renders a text primitive regardless of this value.
   *
   * @default undefined
   */
  as?: typeof validAsValues[number];
  /**
   * Clamps long content to the given number of lines and shows an ellipsis when text overflows.
   *
   * @default undefined
   */
  truncateAfterLines?: number;
  /**
   * Text content or inline elements to render inside the Text component.
   */
  children: React.ReactNode;
  /**
   * Sets the font weight using Compass typography weight tokens.
   *
   * @default 'regular'
   */
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
  /**
   * Sets the text color using a semantic color token from the Compass theme.
   * Takes priority over variant-driven defaults when provided.
   *
   * @default 'surface.text.gray.normal'
   */
  color?: BaseTextProps['color'];
  /**
   * Aligns text within its layout box on web.
   *
   * @default undefined
   */
  textAlign?: BaseTextProps['textAlign'];
  /**
   * Transforms text casing (for example uppercase labels).
   *
   * @default undefined
   */
  textTransform?: BaseTextProps['textTransform'];
  /**
   * Adds underline, strikethrough, or dotted emphasis to the text.
   *
   * @default undefined
   */
  textDecorationLine?: BaseTextProps['textDecorationLine'];
  /**
   * Controls how words break when lines wrap in narrow containers.
   *
   * @default undefined
   */
  wordBreak?: BaseTextProps['wordBreak'];
} & TestID &
  ElementTiming &
  StyledPropsCompass;

export type TextBodyVariant = TextCommonProps & {
  /**
   * Selects the body typography preset (paragraph-style copy).
   *
   * @default 'body'
   */
  variant?: Extract<TextVariant, 'body'>;
  /**
   * Sets the body text size on the Compass type scale.
   *
   * @default 'medium'
   */
  size?: Extract<BaseTextSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
};

export type TextCaptionVariant = TextCommonProps & {
  /**
   * Selects the caption typography preset for supporting or metadata copy.
   */
  variant?: Extract<TextVariant, 'caption'>;
  /**
   * Sets the caption text size on the Compass type scale.
   *
   * @default 'medium'
   */
  size?: Extract<BaseTextSizes, 'small' | 'medium'>;
};

export type TextProps<T> = T extends { variant: infer Variant }
  ? Variant extends 'caption'
    ? TextCaptionVariant
    : Variant extends 'body'
    ? TextBodyVariant
    : T
  : T;
