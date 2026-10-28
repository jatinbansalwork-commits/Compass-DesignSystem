import type { TableExperienceEmptyReason } from './types';

const getEmptyReason = (
  visibleRowCount: number,
  totalRowCount: number,
): TableExperienceEmptyReason | null => {
  if (visibleRowCount > 0) {
    return null;
  }
  return totalRowCount === 0 ? 'no-data' : 'no-results';
};

export { getEmptyReason };
