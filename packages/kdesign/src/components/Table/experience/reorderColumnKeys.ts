/** Moves one column key within `order`, preserving keys not in the list. */
const reorderColumnKeys = (order: string[], fromIndex: number, toIndex: number): string[] => {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
    return order;
  }
  if (fromIndex >= order.length || toIndex >= order.length) {
    return order;
  }
  const next = [...order];
  const [removed] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, removed);
  return next;
};

/** Visible keys in layout order (hidden keys omitted). */
const orderedVisibleColumnKeys = (columnOrder: string[], visibleColumnKeys: string[]): string[] => {
  const visible = new Set(visibleColumnKeys);
  return columnOrder.filter((key) => visible.has(key));
};

export { reorderColumnKeys, orderedVisibleColumnKeys };
