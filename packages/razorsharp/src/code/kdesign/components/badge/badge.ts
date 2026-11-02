import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { convertFigmaIconNameToKdesignIconName, isIconInstance } from '../../utils/iconUtils';
import { isPresent } from '../../utils/isPresent';
import { findNode } from '../../utils/findNode';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { kdesignImports } from '../../utils/imports';
import { defaultProps } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { KdesignComponentInstanceNode, KdesignGroupNode, KdesignProps } from '~/code/types/Kdesign';

export const transformBadge = (
  kdesignInstance: KdesignComponentInstanceNode,
): TransformFunctionReturnType => {
  const isIconPresent = isPresent(kdesignInstance.componentProperties.Icon?.value);

  // TODO figure out why this prop does not exist in Kdesign code
  // const isAllCaps = isPresent(kdesignInstance.componentProperties.allCaps?.value);

  const contrast = jsxValue(kdesignInstance.componentProperties.contrast?.value).toLowerCase();
  const intent = jsxValue(kdesignInstance.componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(kdesignInstance.componentProperties.size?.value).toLowerCase();

  const children = findTextByLayerName(kdesignInstance, 'badge-text') ?? '';

  // TODO figure out why figma structure for Badge icon is
  // different from the way it is done in other places
  let icon = '';
  if (isIconPresent) {
    const iconNodeWrapper = findNode(
      kdesignInstance,
      (kdesignNode) => kdesignNode.layerName === 'badge-icon',
    ) as KdesignGroupNode;
    const iconNode = iconNodeWrapper.children[0];
    if (iconNode && isIconInstance(iconNode as KdesignComponentInstanceNode)) {
      icon = convertFigmaIconNameToKdesignIconName(
        (iconNode as KdesignComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  const props: KdesignProps = {
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
    imports: kdesignImports([icon, 'Badge']),
  };
};
