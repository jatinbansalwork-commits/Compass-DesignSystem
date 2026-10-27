import type React from 'react';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, StringChildrenType, TestID } from '~utils/types';
import type { MotionMetaProp } from '~components/BaseMotion';

export type RadioProps = {
  /**
   * Sets the label text of the Radio
   */
  children?: StringChildrenType;
  /**
   * Help text for the Radio
   */
  helpText?: string;
  /**
   * The value to be used in the Radio input.
   * This is the value that will be returned on form submission.
   */
  value: string;
  /**
   * If `true`, the Radio will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Size of the radios
   *
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Trailing element to display alongside the radio label (e.g. a `<Badge>`).
   * Only rendered when the parent `RadioGroup` has `orientation="vertical"`.
   */
  trailing?: React.ReactElement;
  /**
   * @private
   * Internal prop to hide the radio icon
   * @default false
   */
  _hideRadioIcon?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360 &
  MotionMetaProp;
