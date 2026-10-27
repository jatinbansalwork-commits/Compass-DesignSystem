import React from 'react';
import { checkboxSizes } from '../checkboxTokens';
import { CheckboxGroupProvider } from './CheckboxGroupContext';
import { useCheckboxGroup } from './useCheckboxGroup';
import { FormLabel, FormHint } from '~components/Form';
import BaseBox from '~components/Box/BaseBox';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { useBreakpoint } from '~utils';

import { useTheme } from '~components/Klear360Provider';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { CheckboxGroupProps } from './checkboxGroupTypes';

const CheckboxGroup = ({
  children,
  label,
  helpText,
  isDisabled = false,
  isRequired = false,
  necessityIndicator = 'none',
  labelPosition = 'top',
  validationState,
  errorText,
  name,
  defaultValue,
  onChange,
  value,
  size = 'medium',
  testID,
  orientation = 'vertical',
  flexWrap = 'nowrap',
  ...rest
}: CheckboxGroupProps): React.ReactElement => {
  const { contextValue, ids } = useCheckboxGroup({
    defaultValue,
    onChange,
    value,
    isDisabled,
    necessityIndicator,
    isRequired,
    name,
    labelPosition,
    validationState,
    size,
  });

  const { theme } = useTheme();
  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `,${showError ? errorText : ''} ${showHelpText ? helpText : ''}`;
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const gap = checkboxSizes.group.gap[size][matchedDeviceType];

  return (
    <CheckboxGroupProvider value={contextValue}>
      <BaseBox {...getStyledProps(rest)}>
        <SelectorGroupField
          position={labelPosition}
          labelledBy={ids.labelId}
          componentName="checkbox-group"
          testID={testID}
          {...makeAnalyticsAttribute(rest)}
        >
          {label ? (
            <FormLabel
              as="span"
              necessityIndicator={necessityIndicator}
              position={labelPosition}
              id={ids.labelId}
              accessibilityText={accessibilityText}
              size={size}
            >
              {label}
            </FormLabel>
          ) : null}
          <BaseBox>
            <BaseBox
              display="flex"
              flexDirection={orientation === 'horizontal' ? 'row' : 'column'}
              gap={gap}
              flexWrap={flexWrap}
            >
              {React.Children.map(children, (child, index) => {
                // AUDIT: key={index} — may cause reconciliation issues if list reorders
                return <BaseBox key={index}>{child}</BaseBox>;
              })}
            </BaseBox>
            <FormHint
              size={size}
              errorText={errorText}
              helpText={helpText}
              type={validationState === 'error' ? 'error' : 'help'}
            />
          </BaseBox>
        </SelectorGroupField>
      </BaseBox>
    </CheckboxGroupProvider>
  );
};

export type { CheckboxGroupProps } from './checkboxGroupTypes';
export { CheckboxGroup };
