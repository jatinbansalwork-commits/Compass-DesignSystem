import type {
  CompassComponentInstanceNode,
  CompassFrameNode,
  CompassGroupNode,
  CompassNode,
} from '~/code/types/Compass';

const canHaveChildren = (
  node: CompassNode,
): node is CompassGroupNode | CompassFrameNode | CompassComponentInstanceNode => {
  return node.type === 'GROUP' || node.type === 'FRAME' || node.type === 'INSTANCE';
};

export const findNode = (
  node: CompassNode,
  processNode: (node: CompassNode) => boolean,
): null | CompassNode => {
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
