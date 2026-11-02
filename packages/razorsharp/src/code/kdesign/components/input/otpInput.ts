import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformOtpInput = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = kdesignComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helperText?.value);

  const props: KdesignProps = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
    },
    otpLength: {
      value: jsxValue(componentProperties.numberOfFields?.value).toLowerCase(),
      type: 'number',
    },
  };

  props.label = {
    value: findTextByLayerName(kdesignComponentInstance, 'Label') ?? '',
    type: 'string',
  };

  if (isHelpTextPresent) {
    props.helpText = {
      value: findTextByLayerName(kdesignComponentInstance, 'Help Text') ?? '',
      type: 'string',
    };
  }

  return {
    component: component('OTPInput', { props, defaultValues }),
    imports: kdesignImports(['OTPInput']),
  };
};
