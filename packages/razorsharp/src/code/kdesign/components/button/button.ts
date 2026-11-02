import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { findIconByLayerName } from '../../utils/findIconByLayerName';
import { kdesignImports } from '../../utils/imports';
import { transformButtonVariant } from './utils';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignProps } from '~/code/types/Kdesign';

export const transformButton = (
  kdesignComponentInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = kdesignComponentInstance.componentProperties;

  const size = componentProperties.size?.value;
  const variant = componentProperties.variant?.value;
  let icon = '';
  let iconPosition = '';

  const children = findTextByLayerName(kdesignComponentInstance, 'Text') ?? '';

  const iconLeftNode = findNode(
    kdesignComponentInstance,
    (kdesignNode) => kdesignNode.layerName === 'Icon Left',
  );

  if (iconLeftNode) {
    icon = findIconByLayerName(iconLeftNode, 'Icon (change here)') ?? '';
    iconPosition = 'left';
  }

  const iconRightNode = findNode(
    kdesignComponentInstance,
    (kdesignNode) => kdesignNode.layerName === 'Icon Right',
  );

  if (iconRightNode) {
    icon = findIconByLayerName(iconRightNode, 'Icon (change here)') ?? '';
    iconPosition = 'right';
  }

  const props: KdesignProps = {
    size: { value: jsxValue(size).toLowerCase(), type: 'string' },
    variant: {
      value: transformButtonVariant(jsxValue(variant)),
      type: 'string',
    },
    isFullWidth: {
      value: jsxValue(componentProperties.isFullWidth?.value),
      type: 'boolean',
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
    component: component('Button', {
      props,
      defaultValues,
      children,
    }),
    imports: kdesignImports(['Button', icon]),
  };
};
