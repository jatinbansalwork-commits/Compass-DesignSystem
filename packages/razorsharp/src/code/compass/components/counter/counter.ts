import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { CompassComponentInstanceNode, CompassProps } from '~/code/types/Compass';

export const transformCounter = (
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
    contrast: {
      value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
      type: 'string',
    },
  };

  return {
    component: component('Counter', { props, defaultValues }),
    imports: bladeImports(['Counter']),
  };
};
