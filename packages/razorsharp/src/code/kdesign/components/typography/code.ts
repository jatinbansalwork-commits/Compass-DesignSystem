import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { codeDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformCode = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: KdesignProps = {};

  const componentProperties = kdesignInstance.componentProperties;

  props.size = {
    value: jsxValue(componentProperties.variant?.value).toLowerCase(),
    type: 'string',
  };

  const children = findTextByLayerName(kdesignInstance, 'Text') ?? '';

  return {
    component: component('Code', {
      props,
      defaultValues: codeDefaultValues,
      children,
    }),
    imports: kdesignImports(['Code']),
  };
};
