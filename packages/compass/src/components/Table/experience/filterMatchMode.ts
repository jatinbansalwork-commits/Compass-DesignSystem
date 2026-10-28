type TableExperienceFilterMatchMode =
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'equals'
  | 'notEquals';

const FILTER_MATCH_MODE_LABELS: Record<TableExperienceFilterMatchMode, string> = {
  contains: 'Contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  equals: 'Equals',
  notEquals: 'Not equals',
};

const matchesWithMode = (cellValue: string, filterValue: string, mode: TableExperienceFilterMatchMode): boolean => {
  const left = cellValue.toLowerCase();
  const right = filterValue.toLowerCase();
  switch (mode) {
    case 'contains':
      return left.includes(right);
    case 'startsWith':
      return left.startsWith(right);
    case 'endsWith':
      return left.endsWith(right);
    case 'equals':
      return left === right;
    case 'notEquals':
      return left !== right;
    default:
      return left.includes(right);
  }
};

export { matchesWithMode, FILTER_MATCH_MODE_LABELS };
export type { TableExperienceFilterMatchMode };
