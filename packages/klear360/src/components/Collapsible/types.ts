import type { ReactNode } from 'react';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type CollapsibleProps = {
  /** Composes `CollapsibleButton`, `CollapsibleLink`, `CollapsibleText`, `CollapsibleBody` */
  children: ReactNode;
  /** Direction in which the content expands @default bottom */
  direction?: 'bottom' | 'top';
  /** Expands the collapsible content by default (uncontrolled) @default false */
  defaultIsExpanded?: boolean;
  /** Expands the collapsible content (controlled) */
  isExpanded?: boolean;
  /** Callback for change in collapsible's expanded state */
  onExpandChange?: ({ isExpanded }: { isExpanded: boolean }) => void;
  /** **Internal**: disables trigger validations. Used for AccordionButton and SideNavLink internally */
  _dangerouslyDisableValidations?: boolean;
  /** **Internal**: used to override responsive width restrictions */
  _shouldApplyWidthRestrictions?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360;

type CollapsibleBodyProps = {
  children: ReactNode;
  width?: BaseBoxProps['width'];
  /**
   * Internal
   *
   * Set to false to remove margin of CollapsibleBody
   */
  _hasMargin?: boolean;
} & DataAnalyticsAttribute &
  TestID;

type CollapsibleBodyContentProps = {
  children: ReactNode;
  _hasMargin?: CollapsibleBodyProps['_hasMargin'];
};

type CollapsibleTextProps = {
  /**
   * Text content for the trigger
   */
  children: ReactNode;

  /**
   * Size of the text
   *
   * @default 'medium'
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';

  /**
   * Weight of the text
   *
   * @default 'regular'
   */
  weight?: 'regular' | 'medium' | 'semibold';

  /**
   * Color of the text
   */
  color?: BaseTextProps['color'];

  /**
   * Disables the trigger
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Accessibility label for the trigger
   */
  accessibilityLabel?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360;

export type { CollapsibleBodyProps, CollapsibleBodyContentProps, CollapsibleTextProps };
