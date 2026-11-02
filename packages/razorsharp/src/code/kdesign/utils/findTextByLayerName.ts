import { findNode } from './findNode';
import type { KdesignNode, KdesignTextNode } from '~/code/types/Kdesign';

const isKdesignTextNode = (node: KdesignNode | null): node is KdesignTextNode => {
  if (node === null) return false;
  return node.type === 'TEXT';
};

export const findTextByLayerName = (kdesignNode: KdesignNode, layerName: string): string | null => {
  const validateNode: (node: KdesignNode) => boolean = (node) =>
    node.layerName === layerName && node.type === 'TEXT';

  const textNode = findNode(kdesignNode, validateNode);
  return isKdesignTextNode(textNode) ? textNode.characters.trim() : null;
};
