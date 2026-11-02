import { DEFAULT_WIDTH_PX, type ColumnLayoutMeta } from './buildGridTemplateColumns';

type BuildExperienceStickyLeadingLayoutArgs = {
  orderedColumnKeys: string[];
  /** Leading *data* columns to freeze (first N in column order). Does not include the multi-select checkbox. */
  stickyLeadingDataColumnCount: number;
  columnWidths: Record<string, number>;
  columns: ColumnLayoutMeta[];
};

type ExperienceStickyLeadingLayout = {
  stickyColumnCount: number;
  stickyColumnWidths: string[];
  stickyLeadingColumnKeys: string[];
};

/**
 * Derives {@link TableProps} `stickyColumnCount` / `stickyColumnWidths` from experience column order.
 * With `selectionType="multiple"`, the checkbox column is frozen automatically by `Table` — pass only
 * how many data columns after it should stick (e.g. `1` → checkbox + Shipment ID).
 */
const buildExperienceStickyLeadingLayout = ({
  orderedColumnKeys,
  stickyLeadingDataColumnCount,
  columnWidths,
  columns,
}: BuildExperienceStickyLeadingLayoutArgs): ExperienceStickyLeadingLayout => {
  const stickyColumnCount = Math.max(
    0,
    Math.min(stickyLeadingDataColumnCount, orderedColumnKeys.length),
  );
  const stickyLeadingColumnKeys = orderedColumnKeys.slice(0, stickyColumnCount);
  const metaByKey = new Map(columns.map((column) => [column.key, column]));
  const stickyColumnWidths = stickyLeadingColumnKeys.map((key) => {
    const meta = metaByKey.get(key);
    const widthPx = columnWidths[key] ?? meta?.defaultWidthPx ?? DEFAULT_WIDTH_PX;
    return `${widthPx}px`;
  });

  return { stickyColumnCount, stickyColumnWidths, stickyLeadingColumnKeys };
};

export { buildExperienceStickyLeadingLayout };
export type { BuildExperienceStickyLeadingLayoutArgs, ExperienceStickyLeadingLayout };
