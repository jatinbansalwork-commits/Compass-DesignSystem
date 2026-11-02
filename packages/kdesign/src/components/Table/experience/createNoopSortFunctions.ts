import type { TableNode } from '../types';

/**
 * Identity sort fns so {@link Table} keeps sortable headers while the experience layer
 * applies {@link applyMultiSort} on `data.nodes` before render.
 */
const createNoopSortFunctions = <Item>(
  sortFunctions: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]> | undefined,
): Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]> | undefined => {
  if (!sortFunctions) {
    return undefined;
  }
  return Object.fromEntries(
    Object.keys(sortFunctions).map((key) => [key, (array: TableNode<Item>[]) => array]),
  );
};

export { createNoopSortFunctions };
