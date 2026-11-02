import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { textDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformText = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: KdesignProps = {};

  const componentProperties = kdesignInstance.componentProperties;

  props.size = {
    value: jsxValue(componentProperties.size?.value).toLowerCase(),
    type: 'string',
  };

  props.type = {
    value: jsxValue(componentProperties.type?.value).toLowerCase(),
    type: 'string',
  };

  props.weight = {
    value: jsxValue(componentProperties.weight?.value).toLowerCase(),
    type: 'string',
  };

  props.contrast = {
    value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
    type: 'string',
  };

  props.variant = {
    value: jsxValue(componentProperties.variant?.value).toLowerCase(),
    type: 'string',
  };

  const children = findTextByLayerName(kdesignInstance, 'Text') ?? '';

  return {
    component: component('Text', {
      props,
      defaultValues: textDefaultValues,
      children,
    }),
    imports: kdesignImports(['Text']),
  };
};
