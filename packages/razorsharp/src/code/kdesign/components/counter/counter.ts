import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { kdesignImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformCounter = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = kdesignComponentInstance.componentProperties;

  const props: KdesignProps = {
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
    imports: kdesignImports(['Counter']),
  };
};
