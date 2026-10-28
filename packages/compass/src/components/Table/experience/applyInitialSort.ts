import type { TableExperienceInitialSort } from './types';
import type { TableNode } from '../types';

/**
 * Client-side presort helper for controllers — applies the same {@link sortFunctions}
 * entry the table would use, without changing server fetch logic.
 */
const applyInitialSort = <Item>(
  nodes: TableNode<Item>[],
  initialSort: TableExperienceInitialSort | undefined,
  sortFunctions: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]> | undefined,
): TableNode<Item>[] => {
  if (!initialSort?.sortKey || !sortFunctions?.[initialSort.sortKey]) {
    return nodes;
  }
  const sorted = sortFunctions[initialSort.sortKey]([...nodes]);
  if (initialSort.direction === 'desc') {
    return [...sorted].reverse();
  }
  return sorted;
};

export { applyInitialSort };
