import { convertFigmaIconNameToCompassIconName, isIconInstance } from '../../utils/iconUtils';
import { findNode } from '../../utils/findNode';
import type { CompassComponentInstanceNode } from '~/code/types/Compass';

export const getLinkIcon = (
  bladeInstance: CompassComponentInstanceNode,
  iconLayerName: 'Icon Left' | 'Icon Right',
): string => {
  let icon = '';
  let iconLeftNode = findNode(bladeInstance, (bladeNode) => bladeNode.layerName === iconLayerName);

  if (iconLeftNode !== null) {
    iconLeftNode = findNode(
      iconLeftNode,
      (bladeNode) => bladeNode.layerName === 'Icon (change here)',
    );
    if (isIconInstance(iconLeftNode as CompassComponentInstanceNode)) {
      icon = convertFigmaIconNameToCompassIconName(
        (iconLeftNode as CompassComponentInstanceNode)?.name || 'unidentified-icon',
      );
    }
  }

  return icon;
};

export const getLinkIconProps = (
  bladeInstance: CompassComponentInstanceNode,
): { icon: string; iconPosition: '' | 'left' | 'right' } => {
  const leftIcon = getLinkIcon(bladeInstance, 'Icon Left');
  if (leftIcon) {
    return { icon: leftIcon, iconPosition: 'left' };
  }

  const rightIcon = getLinkIcon(bladeInstance, 'Icon Right');
  if (rightIcon) {
    return { icon: rightIcon, iconPosition: 'right' };
  }

  return { icon: '', iconPosition: '' };
};
