import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findIconByLayerName } from '../../utils/findIconByLayerName';
import { kdesignImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformIconButton = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = kdesignComponentInstance.componentProperties;

  const props: KdesignProps = {
    icon: {
      value: findIconByLayerName(kdesignComponentInstance, 'Icon (change here)') ?? '',
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
    imports: kdesignImports(['IconButton']),
  };
};
