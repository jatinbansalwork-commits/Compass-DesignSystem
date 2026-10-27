import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { codeDefaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { CompassComponentInstanceNode, CompassProps } from '~/code/types/Compass';

export const transformCode = (
  bladeInstance: CompassComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: CompassProps = {};

  const componentProperties = bladeInstance.componentProperties;

  props.size = {
    value: jsxValue(componentProperties.variant?.value).toLowerCase(),
    type: 'string',
  };

  const children = findTextByLayerName(bladeInstance, 'Text') ?? '';

  return {
    component: component('Code', {
      props,
      defaultValues: codeDefaultValues,
      children,
    }),
    imports: bladeImports(['Code']),
  };
};
