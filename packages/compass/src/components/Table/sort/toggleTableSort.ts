import type { TableSortOrderEntry } from '../types';

type ToggleTableSortOptions = {
  shiftKey?: boolean;
  removableSort?: boolean;
};

/** Click cycles asc → desc → none; Shift+click stacks columns. */
const toggleTableSort = (
  currentOrder: TableSortOrderEntry[],
  sortKey: string,
  options: ToggleTableSortOptions = {},
): TableSortOrderEntry[] => {
  const { shiftKey = false, removableSort = true } = options;
  const existingIndex = currentOrder.findIndex((entry) => entry.sortKey === sortKey);

  if (shiftKey) {
    if (existingIndex === -1) {
      return [...currentOrder, { sortKey, direction: 'asc' }];
    }
    const entry = currentOrder[existingIndex];
    if (entry.direction === 'asc') {
      const next = [...currentOrder];
      next[existingIndex] = { sortKey, direction: 'desc' };
      return next;
    }
    return currentOrder.filter((_, index) => index !== existingIndex);
  }

  if (existingIndex === -1 || currentOrder.length !== 1 || currentOrder[0].sortKey !== sortKey) {
    return [{ sortKey, direction: 'asc' }];
  }

  const primary = currentOrder[0];
  if (primary.direction === 'asc') {
    return [{ sortKey, direction: 'desc' }];
  }
  if (removableSort) {
    return [];
  }
  return [{ sortKey, direction: 'asc' }];
};

const toggleTableSortFromTableHeader = (
  currentOrder: TableSortOrderEntry[],
  sortKey: string,
  isSortReversed: boolean,
  options: ToggleTableSortOptions = {},
): TableSortOrderEntry[] => {
  if (options.shiftKey) {
    return toggleTableSort(currentOrder, sortKey, options);
  }
  const primary = currentOrder[0];
  if (!primary || primary.sortKey !== sortKey) {
    return [{ sortKey, direction: isSortReversed ? 'desc' : 'asc' }];
  }
  if (primary.direction === 'asc' && isSortReversed) {
    return [{ sortKey, direction: 'desc' }];
  }
  if (primary.direction === 'desc' && !isSortReversed && options.removableSort !== false) {
    return [];
  }
  return [{ sortKey, direction: isSortReversed ? 'desc' : 'asc' }];
};

export { toggleTableSort, toggleTableSortFromTableHeader };
export type { ToggleTableSortOptions };
