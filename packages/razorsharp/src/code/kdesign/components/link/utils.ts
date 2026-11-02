import { convertFigmaIconNameToKdesignIconName, isIconInstance } from '../../utils/iconUtils';
import { findNode } from '../../utils/findNode';
import type { KdesignComponentInstanceNode } from '~/code/types/Kdesign';

export const getLinkIcon = (
  kdesignInstance: KdesignComponentInstanceNode,
  iconLayerName: 'Icon Left' | 'Icon Right',
): string => {
  let icon = '';
  let iconLeftNode = findNode(kdesignInstance, (kdesignNode) => kdesignNode.layerName === iconLayerName);

  if (iconLeftNode !== null) {
    iconLeftNode = findNode(
      iconLeftNode,
      (kdesignNode) => kdesignNode.layerName === 'Icon (change here)',
    );
    if (isIconInstance(iconLeftNode as KdesignComponentInstanceNode)) {
      icon = convertFigmaIconNameToKdesignIconName(
        (iconLeftNode as KdesignComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  return icon;
};

export const getLinkIconProps = (
  kdesignInstance: KdesignComponentInstanceNode,
): { icon: string; iconPosition: '' | 'left' | 'right' } => {
  const leftIcon = getLinkIcon(kdesignInstance, 'Icon Left');
  if (leftIcon) {
    return { icon: leftIcon, iconPosition: 'left' };
  }

  const rightIcon = getLinkIcon(kdesignInstance, 'Icon Right');
  if (rightIcon) {
    return { icon: rightIcon, iconPosition: 'right' };
  }

  return { icon: '', iconPosition: '' };
};
