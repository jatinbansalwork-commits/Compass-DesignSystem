import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { CompassComponentInstanceNode, CompassProps } from '~/code/types/Compass';

export const transformIndicator = (
  bladeComponentInstance: CompassComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const props: CompassProps = {
    intent: {
      value: jsxValue(componentProperties.intent?.value).toLowerCase(),
      type: 'string',
    },
    size: {
      value: jsxValue(componentProperties.size?.value).toLowerCase(),
      type: 'string',
    },
  };

  const children = findTextByLayerName(bladeComponentInstance, 'Label') ?? '';

  return {
    component: component('Indicator', { props, defaultValues, children }),
    imports: bladeImports(['Indicator']),
  };
};
