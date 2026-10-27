import type React from 'react';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

export type RadioGroupProps = {
  /**
   * Radio children to lay out as a group (typically multiple `Radio` components).
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
   * Disables every radio in the group.
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
   * Visible label for the radio group.
   *
   * @default undefined
   */
  label?: string;
  /**
   * Places the label above or to the left of the radio list.
   *
   * @default 'top'
   */
  labelPosition?: 'top' | 'left';
  /**
   * Initial selected value when the group is uncontrolled.
   *
   * @default undefined
   */
  defaultValue?: string;
  /**
   * Controlled selected value; use with `onChange`.
   *
   * @default undefined
   */
  value?: string;
  /**
   * Fired when the selected radio in the group changes.
   *
   * @default undefined
   */
  onChange?: ({
    name,
    value,
    event,
  }: {
    name: string | undefined;
    value: string;
    event: React.ChangeEvent<HTMLInputElement>;
  }) => void;
  /**
   * Name submitted with form data for the group.
   *
   * @default undefined
   */
  name?: string;
  /**
   * Size passed to each radio in the group.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Stacks radios vertically or in a horizontal row.
   *
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsCompass;
