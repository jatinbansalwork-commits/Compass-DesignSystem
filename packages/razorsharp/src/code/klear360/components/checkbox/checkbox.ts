import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { checkboxDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformCheckbox = (
  bladeInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const children = findTextByLayerName(bladeInstance, 'Label') ?? '';

  const isHelpTextPresent = isPresent(bladeInstance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    helpText = findTextByLayerName(bladeInstance, 'Help Text') ?? '';
  }

  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const props: Klear360Props = {
    size: {
      type: 'string',
      value: size,
    },
    helpText: {
      value: helpText,
      type: 'string',
    },
  };

  return {
    component: component('Checkbox', {
      props,
      defaultValues: checkboxDefaultValues,
      children,
    }),
    imports: bladeImports(['Checkbox']),
  };
};
