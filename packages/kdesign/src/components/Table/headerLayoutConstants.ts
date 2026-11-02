import { tableRow } from './tokens';

/** Compact header row height (px) — label row(s) and filter band share this track size. */
const TABLE_HEADER_COMPACT_ROW_HEIGHT_PX = Number(tableRow.minHeight.compact);

/**
 * Sticky `top` for the filter band: sum of label row heights above it. Borders are drawn inside
 * each row's fixed height (`box-sizing: border-box`), so do not add border width again.
 */
const getFilterRowStickyTopOffsetPx = (labelRowCount: number): number =>
  Math.max(labelRowCount, 1) * TABLE_HEADER_COMPACT_ROW_HEIGHT_PX;

export { TABLE_HEADER_COMPACT_ROW_HEIGHT_PX, getFilterRowStickyTopOffsetPx };
