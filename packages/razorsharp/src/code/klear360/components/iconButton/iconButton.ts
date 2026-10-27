import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findIconByLayerName } from '../../utils/findIconByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformIconButton = (
  bladeComponentInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const props: Klear360Props = {
    icon: {
      value: findIconByLayerName(bladeComponentInstance, 'Icon (change here)') ?? '',
      type: 'instance',
    },
    // TODO figure out why figma sizes are in pixel and
    // not props like "medium", "small"
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
    component: component('IconButton', { props, defaultValues }),
    imports: bladeImports(['IconButton']),
  };
};
