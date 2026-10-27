import type React from 'react';
import type { MotionMetaProp } from '~components/BaseMotion';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

export type CheckboxProps = {
  /**
   * If `true`, The checkbox will be checked. This also makes the checkbox controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked. This also makes the checkbox uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: OnChange;
  /**
   * Sets the label of the checkbox
   */
  children?: React.ReactNode;
  /**
   * Help text for the checkbox
   */
  helpText?: string;
  /**
   * Error text for the checkbox
   *
   * Renders when `validationState` is set to 'error'
   */
  errorText?: string;
  /**
   * If `true`, the checkbox will be indeterminate.
   * This does not modify the isChecked property.
   *
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the checkbox will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the checkbox input is marked as required,
   * and `required` attribute will be added
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `error`, the checkbox input is marked as invalid,
   * and `invalid` attribute will be added
   */
  validationState?: 'error' | 'none';
  /**
   * Size of the checkbox
   *
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Sets the tab-index property on checkbox element
   *
   */
  tabIndex?: number;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsCompass &
  MotionMetaProp;
