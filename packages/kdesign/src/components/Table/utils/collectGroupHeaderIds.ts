import type { Identifier, TableNode } from '../types';

type NodeWithChildren<Item> = TableNode<Item> & { nodes?: TableNode<Item>[] | null };

/** Ids of rows that have nested `nodes` (group headers), depth-first. */
const collectGroupHeaderIds = <Item>(nodes: TableNode<Item>[]): Identifier[] => {
  const ids: Identifier[] = [];
  nodes.forEach((node) => {
    const children = (node as NodeWithChildren<Item>).nodes;
    if (Array.isArray(children) && children.length > 0) {
      ids.push(node.id);
      ids.push(...collectGroupHeaderIds(children));
    }
  });
  return ids;
};

export { collectGroupHeaderIds };
