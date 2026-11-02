import type {
  KdesignComponentInstanceNode,
  KdesignFrameNode,
  KdesignGroupNode,
  KdesignNode,
} from '~/code/types/Kdesign';

const canHaveChildren = (
  node: KdesignNode,
): node is KdesignGroupNode | KdesignFrameNode | KdesignComponentInstanceNode => {
  return node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE';
};

export const findNode = (
  node: KdesignNode,
  processNode: (node: KdesignNode) => boolean,
): null | KdesignNode => {
  if (node) {
    const shouldStopTraversal = processNode(node);
    if (shouldStopTraversal) {
      return node;
    }

    if (canHaveChildren(node)) {
      const children = node.children;

      for (const child of children) {
        const newNode = findNode(child, processNode);
        if (newNode) {
          return newNode;
        }
      }
    }

    return null;
  }

  return null;
};
