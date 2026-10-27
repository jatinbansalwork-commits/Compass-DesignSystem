import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { convertFigmaIconNameToKlear360IconName, isIconInstance } from '../../utils/iconUtils';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultProps } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { Klear360ComponentInstanceNode, Klear360GroupNode, Klear360Props } from '~/code/types/Klear360';

export const transformBadge = (
  bladeInstance: Klear360ComponentInstanceNode,
): TransformFunctionReturnType => {
  const isIconPresent = isPresent(bladeInstance.componentProperties.Icon?.value);

  // TODO figure out why this prop does not exist in Klear360 code
  // const isAllCaps = isPresent(bladeInstance.componentProperties.allCaps?.value);

  const contrast = jsxValue(bladeInstance.componentProperties.contrast?.value).toLowerCase();
  const intent = jsxValue(bladeInstance.componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const children = findTextByLayerName(bladeInstance, 'badge-text') ?? '';

  // TODO figure out why figma structure for Badge icon is
  // different from the way it is done in other places
  let icon = '';
  if (isIconPresent) {
    const iconNodeWrapper = findNode(
      bladeInstance,
      (bladeNode) => bladeNode.layerName === 'badge-icon',
    ) as Klear360GroupNode;
    const iconNode = iconNodeWrapper.children[0];
    if (iconNode && isIconInstance(iconNode as Klear360ComponentInstanceNode)) {
      icon = convertFigmaIconNameToKlear360IconName(
        (iconNode as Klear360ComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  const props: Klear360Props = {
    contrast: {
      type: 'string',
      value: contrast,
    },
    variant: {
      type: 'string',
      value: intent,
    },
    size: {
      type: 'string',
      value: size,
    },
    icon: {
      type: 'instance',
      value: icon,
    },
  };

  return {
    component: component('Badge', {
      props,
      defaultValues: defaultProps,
      children,
    }),
    imports: bladeImports([icon, 'Badge']),
  };
};
