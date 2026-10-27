import type React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { CSSObject } from 'styled-components';
import type { Elevation } from '~tokens/global';
import type { BoxProps } from '~components/Box';
import type { Theme } from '~components/CompassProvider';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { Platform } from '~utils';
import type { SpacingValueType } from '~components/Box/BaseBox';

type CardSpacingValueType = Extract<
  SpacingValueType,
  'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'
>;
type CardVariant = 'primary' | 'secondary';

type CardSurfaceBackgroundColors = `surface.background.gray.${DotNotationToken<
  Theme['colors']['surface']['background']['gray']
>}`;

export type CardProps = {
  /**
   * Card contents.
   *
   * The expected structure depends on `variant`:
   * - `primary` (default): standard `CardHeader`, `CardBody`, `CardFooter` composition.
   * - `secondary`: `CardBody` only.
   */
  children: React.ReactNode;
  /**
   * Sets the background color of the Card
   *
   * @default `surface.background.gray.intense`
   *
   * @deprecated The `backgroundColor` prop is deprecated and is a no-op. The Card always uses `surface.background.gray.intense`. This prop will be removed in a future major version.
   */
  backgroundColor?: CardSurfaceBackgroundColors;
  /**
   * Sets the border radius of the Card
   *
   * @default `medium`
   *
   * @deprecated The `borderRadius` prop is deprecated and is a no-op. The Card always uses `medium` borderRadius. This prop will be removed in a future major version.
   */
  borderRadius?: Extract<BoxProps['borderRadius'], 'medium' | 'large' | 'xlarge'>;
  /**
   * Sets the elevation for Cards
   *
   * **Links:**
   * - Docs: https://design.klearnow.com/?path=/docs/tokens-elevation--docs
   *
   * @deprecated The `elevation` prop is deprecated and is a no-op. The Card always uses a custom elevation. This prop will be removed in a future major version.
   */
  elevation?: keyof Elevation;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.7`
   *
   * **Links:**
   * - Docs: https://design.klearnow.com/?path=/docs/tokens-spacing--docs
   */
  padding?: CardSpacingValueType;
  /**
   * Sets the width of the card using Compass spacing or layout tokens.
   *
   * @default undefined
   */
  width?: BoxProps['width'];
  /**
   * Sets the height of the card using Compass spacing or layout tokens.
   *
   * @default undefined
   */
  height?: BoxProps['height'];
  /**
   * Sets the minimum height of the card so content does not collapse below this size.
   *
   * @default undefined
   */
  minHeight?: BoxProps['minHeight'];
  /**
   * Sets the minimum width of the card in narrow layouts.
   *
   * @default undefined
   */
  minWidth?: BoxProps['minWidth'];
  /**
   * Sets the maximum width of the card to cap line length or grid column growth.
   *
   * @default undefined
   */
  maxWidth?: BoxProps['maxWidth'];
  /**
   * If `true`, the card will be in selected state
   * Card will have a primary color border around it.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * If `true`, the card is disabled: it becomes non-interactive (`href`/`onClick` are ignored) and
   * is announced as disabled to assistive tech.
   *
   * `isDisabled` takes precedence over `isSelected`.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Makes the Card linkable by setting the `href` prop
   *
   * @default undefined
   */
  href?: string;
  /**
   * Sets the `target` attribute when the card renders as a link (`href` is set).
   *
   * @default undefined
   */
  target?: string;
  /**
   * Sets the `rel` attribute when the card renders as a link (`href` is set).
   *
   * @default undefined
   */
  rel?: string;
  /**
   * Accessible name announced when the card is focusable via `href` or `onClick` and visible text is insufficient.
   *
   * @default undefined
   */
  accessibilityLabel?: string;
  /**
   * If `true`, the card will scale up on hover
   *
   * On mobile devices it will scale down on press
   *
   * **This prop is deprecated in favour of motion presets released in v12**
   *
   * ### Migration
   *
   * ```diff
   * - <Card
   * -  shouldScaleOnHover
   * - />
   *
   * + <Scale motionTriggers={['hover']}>
   * +   <Card />
   * + </Scale>
   * ```
   *
   * @default false
   *
   * @deprecated This prop is deprecated in favour of motion presets released in v12
   */
  shouldScaleOnHover?: boolean;
  /**
   * Callback invoked when the pointer enters the card on web (not fired when `isDisabled` is true).
   *
   * @default undefined
   */
  onHover?: () => void;
  /**
   * Sets the visual variant of the Card
   *
   * - `primary`: Standard card with full composition (CardHeader, CardBody, CardFooter)
   * - `secondary`: Simplified card that only accepts CardBody as children
   *
   * @default 'primary'
   */
  variant?: CardVariant;
  /**
   * Sets the size of the card header title
   *
   * @default 'large'
   */
  size?: 'large' | 'medium';
  /**
   * Callback invoked when the card is activated by click or press (ignored when `isDisabled` is true).
   *
   * @default undefined
   */
  onClick?: (
    event: Platform.Select<{
      web: React.MouseEvent;
      native: GestureResponderEvent;
    }>,
  ) => void;
  /**
   * Sets the HTML element for the Card
   *
   * When `as` is set to `label`, the card will be rendered as a label element
   * This can be used to create a custom checkbox or radio button using the card
   *
   * @default undefined
   */
  as?: 'label';
  /**
   * Sets the CSS cursor when the card is interactive on web.
   *
   * @default undefined
   */
  cursor?: Platform.Select<{
    web: CSSObject['cursor'];
    native: undefined;
  }>;
  /**
   * Sets the opacity of the entire card surface (0–1 on web).
   *
   * @default undefined
   */
  opacity?: BoxProps['opacity'];
  /**
   * Sets CSS transition properties on the card wrapper on web.
   *
   * @default undefined
   */
  transition?: BoxProps['transition'];
  /**
   * Controls flex shrink behavior when the card sits inside a flex row or column.
   *
   * @default undefined
   */
  flexShrink?: BoxProps['flexShrink'];
  /**
   * Sets the overflow behavior of the card content on web.
   *
   * @default undefined
   */
  overflow?: BoxProps['overflow'];
  /**
   * Sets horizontal overflow behavior when content exceeds the card width.
   *
   * @default undefined
   */
  overflowX?: BoxProps['overflowX'];
  /**
   * Sets vertical overflow behavior when content exceeds the card height.
   *
   * @default undefined
   */
  overflowY?: BoxProps['overflowY'];
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsCompass;
