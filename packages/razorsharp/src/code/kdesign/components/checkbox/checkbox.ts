import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { checkboxDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformCheckbox = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const children = findTextByLayerName(kdesignInstance, 'Label') ?? '';

  const isHelpTextPresent = isPresent(kdesignInstance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    helpText = findTextByLayerName(kdesignInstance, 'Help Text') ?? '';
  }

  const size = jsxValue(kdesignInstance.componentProperties.size?.value).toLowerCase();

  const props: KdesignProps = {
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
    imports: kdesignImports(['Checkbox']),
  };
};
