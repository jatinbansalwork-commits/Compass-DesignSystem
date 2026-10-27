import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import { getLinkIconProps } from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360Props } from '~/code/types/Klear360';

export const transformLink = (
  bladeInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const { icon, iconPosition } = getLinkIconProps(bladeInstance);

  const children = findTextByLayerName(bladeInstance, 'Text') ?? '';

  const props: Klear360Props = {
    size: {
      type: 'string',
      value: size,
    },
    icon: {
      value: icon,
      type: 'instance',
    },
    iconPosition: {
      value: iconPosition,
      type: 'string',
    },
  };

  return {
    component: component('Link', {
      props,
      defaultValues,
      children,
    }),
    imports: bladeImports(['Link']),
  };
};
