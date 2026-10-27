import { findNode } from './findNode';
import { convertFigmaIconNameToCompassIconName, isIconInstance } from './iconUtils';
import type { CompassComponentInstanceNode, CompassNode } from '~/code/types/Compass';

const isCompassComponentInstanceNode = (
  node: CompassNode | null,
): node is CompassComponentInstanceNode => {
  if (node === null) return false;
  return node.type === 'INSTANCE';
};

export const findIconByLayerName = (bladeNode: CompassNode, layerName: string): string | null => {
  const validateNode: (node: CompassNode) => boolean = (node) =>
    node.layerName === layerName && node.type === 'INSTANCE';

  const iconNode = findNode(bladeNode, validateNode);
  if (isCompassComponentInstanceNode(iconNode) && isIconInstance(iconNode)) {
    return convertFigmaIconNameToCompassIconName(iconNode.name || 'unidentified-icon');
  }

  return null;
};
