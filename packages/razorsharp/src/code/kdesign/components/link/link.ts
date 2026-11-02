import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { defaultValues } from './constants';
import { getLinkIconProps } from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformLink = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const size = jsxValue(kdesignInstance.componentProperties.size?.value).toLowerCase();

  const { icon, iconPosition } = getLinkIconProps(kdesignInstance);

  const children = findTextByLayerName(kdesignInstance, 'Text') ?? '';

  const props: KdesignProps = {
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
    imports: kdesignImports(['Link']),
  };
};
