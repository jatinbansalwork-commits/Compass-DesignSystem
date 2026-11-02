import { findNode } from './findNode';
import { convertFigmaIconNameToKdesignIconName, isIconInstance } from './iconUtils';
import type { KdesignComponentInstanceNode, KdesignNode } from '~/code/types/Kdesign';

const isKdesignComponentInstanceNode = (
  node: KdesignNode | null,
): node is KdesignComponentInstanceNode => {
  if (node === null) return false;
  return node.type === 'INSTANCE';
};

export const findIconByLayerName = (kdesignNode: KdesignNode, layerName: string): string | null => {
  const validateNode: (node: KdesignNode) => boolean = (node) =>
    node.layerName === layerName && node.type === 'INSTANCE';

  const iconNode = findNode(kdesignNode, validateNode);
  if (isKdesignComponentInstanceNode(iconNode) && isIconInstance(iconNode)) {
    return convertFigmaIconNameToKdesignIconName(iconNode.name || 'unidentified-icon');
  }

  return null;
};
