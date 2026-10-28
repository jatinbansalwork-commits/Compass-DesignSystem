import type { TableNode, TableSortOrderEntry } from '../types';

/**
 * Applies an ordered multi-column sort using the same {@link sortFunctions} map as {@link Table}.
 */
const applyMultiSort = <Item>(
  nodes: TableNode<Item>[],
  sortOrder: TableSortOrderEntry[],
  sortFunctions: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]> | undefined,
): TableNode<Item>[] => {
  if (!sortFunctions || sortOrder.length === 0) {
    return nodes;
  }

  let result = [...nodes];
  for (const entry of [...sortOrder].reverse()) {
    const sortFn = sortFunctions[entry.sortKey];
    if (!sortFn) {
      continue;
    }
    result = sortFn(result);
    if (entry.direction === 'desc') {
      result = [...result].reverse();
    }
  }
  return result;
};

export { applyMultiSort };
