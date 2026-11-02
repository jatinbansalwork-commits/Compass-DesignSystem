type ColumnLayoutMeta = {
  key: string;
  defaultWidthPx?: number;
  minWidthPx?: number;
};

const DEFAULT_WIDTH_PX = 140;
const DEFAULT_MIN_WIDTH_PX = 80;

/**
 * Builds a CSS `grid-template-columns` string for experience column order + widths.
 * Append `trailingSegments` for columns not managed by the layout map (e.g. actions).
 *
 * When `fixedLeadingColumnCount` is set (horizontal sticky lanes), leading tracks use exact
 * pixel widths so they match `stickyColumnWidths` / `left` offsets on sticky cells.
 */
const buildGridTemplateColumns = (
  orderedColumnKeys: string[],
  columnWidths: Record<string, number>,
  columns: ColumnLayoutMeta[],
  trailingSegments: string[] = ['minmax(120px, 1fr)'],
  fixedLeadingColumnCount = 0,
): string => {
  const metaByKey = new Map(columns.map((column) => [column.key, column]));
  const segments = orderedColumnKeys.map((key, index) => {
    const meta = metaByKey.get(key);
    const widthPx = columnWidths[key] ?? meta?.defaultWidthPx ?? DEFAULT_WIDTH_PX;
    const minPx = meta?.minWidthPx ?? DEFAULT_MIN_WIDTH_PX;
    if (index < fixedLeadingColumnCount) {
      return `${widthPx}px`;
    }
    return `minmax(${minPx}px, ${widthPx}px)`;
  });
  return [...segments, ...trailingSegments].join(' ');
};

export { buildGridTemplateColumns, DEFAULT_MIN_WIDTH_PX, DEFAULT_WIDTH_PX };
export type { ColumnLayoutMeta };
