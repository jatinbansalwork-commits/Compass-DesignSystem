/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Side, UseFloatingOptions } from '@floating-ui/react';
import type { CSSProperties } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { DataAnalyticsAttribute } from '~utils/types';
import type { ColorSchemeNames } from '~tokens/theme/theme';
import type { SpacingValueType } from '~components/Box/BaseBox/types/spacingTypes';

type TooltipProps = {
  /**
   * Optional heading shown above the tooltip body text.
   *
   * @default undefined
   */
  title?: string;
  /**
   * Primary tooltip message announced to users on hover or focus.
   */
  content: string;
  /**
   * Placement of tooltip
   *
   * @default "top"
   */
  placement?: Exclude<
    UseFloatingOptions['placement'],
    'left-end' | 'left-start' | 'right-end' | 'right-start'
  >;
  /**
   * Single focusable child element that receives hover and keyboard focus to show the tooltip.
   */
  children: React.ReactElement;
  /**
   * Callback when the tooltip opens or closes.
   *
   * @default undefined
   */
  onOpenChange?: ({ isOpen }: { isOpen: boolean }) => void;
  /**
   * Sets the z-index of the modal
   * @default 1100
   */
  zIndex?: number;
  /**
   * Sets the maximum width of the tooltip content
   *
   * @default 200px
   */
  maxWidth?: SpacingValueType;
} & DataAnalyticsAttribute;

type TooltipContentProps = {
  title?: string;
  children: string;
  style: CSSProperties;
  arrow: React.ReactNode;
  colorScheme: ColorSchemeNames;
  /**
   * react-native only
   */
  isVisible?: boolean;
  /**
   * react-native only
   */
  side?: Side;
  maxWidth?: SpacingValueType;
};

type TooltipContentWrapperProps = {
  styles: CSSProperties;
  side?: Side;
  isVisible?: boolean;
  colorScheme?: ColorSchemeNames;
} & BaseBoxProps;

export type { TooltipProps, TooltipContentProps, TooltipContentWrapperProps };
