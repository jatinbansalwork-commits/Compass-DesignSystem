import type React from 'react';
import type { StyledPropsKlear360 } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type CheckboxGroupProps = {
  /**
   * Checkbox children to lay out as a group (typically multiple `Checkbox` components).
   */
  children: React.ReactNode;
  /**
   * Persistent hint shown below the group when validation is not in error.
   *
   * @default undefined
   */
  helpText?: string;
  /**
   * Error message shown when `validationState` is `error`.
   *
   * @default undefined
   */
  errorText?: string;
  /**
   * Marks the group invalid and shows `errorText` when set to `error`.
   *
   * @default 'none'
   */
  validationState?: 'error' | 'none';
  /**
   * Shows a required or optional marker next to the group label.
   *
   * @default 'none'
   */
  necessityIndicator?: 'required' | 'optional' | 'none';
  /**
   * Disables every checkbox in the group.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Marks the group as required for form submission.
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * Visible label for the checkbox group.
   *
   * @default undefined
   */
  label?: string;
  /**
   * Places the label above or to the left of the checkbox list.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial selected values when the group is uncontrolled.
   *
   * @default undefined
   */
  defaultValue?: string[];
  /**
   * Controlled selected values; use with `onChange`.
   *
   * @default undefined
   */
  value?: string[];
  /**
   * Fired when any checkbox in the group changes selection.
   *
   * @default undefined
   */
  onChange?: ({ name, values }: { name: string; values: string[] }) => void;
  /**
   * Name submitted with form data for the group.
   *
   * @default undefined
   */
  name?: string;
  /**
   * Size passed to each checkbox in the group.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Stacks checkboxes vertically or in a horizontal row.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsKlear360;
