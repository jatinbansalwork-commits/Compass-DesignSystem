/**
 * @table-library {@link HeaderCell} sets grid ARIA (`aria-colindex`, etc.) on `<th>`.
 * Those attributes are not allowed when the cell is a layout spacer (`role="presentation"`).
 */
const TABLE_LIBRARY_GRID_ARIA_ATTRS = [
  'aria-colindex',
  'aria-colspan',
  'aria-rowindex',
  'aria-rowspan',
  'aria-sort',
] as const;

const tableHeaderPresentationCellA11yProps: Record<string, undefined | 'presentation'> = {
  role: 'presentation',
  ...Object.fromEntries(TABLE_LIBRARY_GRID_ARIA_ATTRS.map((attr) => [attr, undefined])),
};

export { tableHeaderPresentationCellA11yProps };
