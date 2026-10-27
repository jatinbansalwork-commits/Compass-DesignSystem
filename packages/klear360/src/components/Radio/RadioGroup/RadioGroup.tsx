import React from 'react';
import { radioSizes } from '../radioTokens';
import { RadioGroupProvider } from './RadioContext';
import { useRadioGroup } from './useRadioGroup';
import BaseBox from '~components/Box/BaseBox';
import { FormHint, FormLabel } from '~components/Form';
import { SelectorGroupField } from '~components/Form/Selector/SelectorGroupField';
import { getStyledProps } from '~components/Box/styledProps';
import { useBreakpoint } from '~utils';
import { useTheme } from '~components/Klear360Provider';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { RadioGroupProps } from './radioGroupTypes';

const RadioGroup = ({
  children,
  label,
  helpText,
  isDisabled = false,
  isRequired = false,
  necessityIndicator = 'none',
  labelPosition = 'top',
  validationState = 'none',
  errorText,
  name,
  defaultValue,
  onChange,
  value,
  size = 'medium',
  orientation = 'vertical',
  testID,
  flexWrap = 'nowrap',
  ...rest
}: RadioGroupProps): React.ReactElement => {
  const { contextValue, ids } = useRadioGroup({
    defaultValue,
    isDisabled,
    isRequired,
    labelPosition,
    name,
    necessityIndicator,
    onChange,
    validationState,
    value,
    size,
    orientation,
  });

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;
  const accessibilityText = `${showError ? errorText : ''} ${showHelpText ? helpText : ''}`.trim();
  const gap = radioSizes.group.gap[size][matchedDeviceType];

  return (
    <RadioGroupProvider value={contextValue}>
      <BaseBox {...getStyledProps(rest)}>
        <SelectorGroupField
          position={labelPosition}
          labelledBy={ids.labelId}
          accessibilityRole="radiogroup"
          componentName="radio-group"
          testID={testID}
          {...makeAnalyticsAttribute(rest)}
        >
          {label ? (
            <FormLabel
              as="span"
              necessityIndicator={necessityIndicator}
              position={labelPosition}
              id={ids.labelId}
              accessibilityText={accessibilityText && `,${accessibilityText}`}
              size={size}
            >
              {label}
            </FormLabel>
          ) : null}
          <BaseBox>
            <BaseBox
              display="flex"
              flexDirection={orientation === 'vertical' ? 'column' : 'row'}
              gap={gap}
              flexWrap={flexWrap}
            >
              {React.Children.map(children, (child, index) => {
                return <BaseBox key={index}>{child}</BaseBox>;
              })}
            </BaseBox>
            <FormHint
              size={size}
              type={validationState === 'error' ? 'error' : 'help'}
              errorText={errorText}
              helpText={helpText}
            />
          </BaseBox>
        </SelectorGroupField>
      </BaseBox>
    </RadioGroupProvider>
  );
};

export type { RadioGroupProps } from './radioGroupTypes';
export { RadioGroup };
