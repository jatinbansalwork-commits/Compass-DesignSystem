import { findNode } from './findNode';
import type { CompassNode, CompassTextNode } from '~/code/types/Compass';

const isCompassTextNode = (node: CompassNode | null): node is CompassTextNode => {
  if (node === null) return false;
  return node.type === 'TEXT';
};

export const findTextByLayerName = (bladeNode: CompassNode, layerName: string): string | null => {
  const validateNode: (node: CompassNode) => boolean = (node) =>
    node.layerName === layerName && node.type === 'TEXT';

  const textNode = findNode(bladeNode, validateNode);
  return isCompassTextNode(textNode) ? textNode.characters.trim() : null;
};
