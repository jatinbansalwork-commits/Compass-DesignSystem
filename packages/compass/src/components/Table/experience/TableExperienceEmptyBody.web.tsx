import React from 'react';
import { TableCell, TableRow } from '../TableBody';
import { TableExperienceEmpty } from './TableExperienceEmpty.web';
import type { TableExperienceEmptyCopy } from './types';
import type { TableNode } from '../types';
import { getEmptyReason } from './getEmptyReason';

type TableExperienceEmptyBodyProps = TableExperienceEmptyCopy & {
  /** Rows currently visible after Table filter/sort/pagination. */
  visibleRowCount: number;
  /** Raw `data.nodes.length` before filtering. */
  totalRowCount: number;
  /**
   * Last grid column index (1-based `gridColumnEnd`) so the empty state spans the table.
   * Include checkbox / action columns in this count when present.
   */
  gridColumnEnd: number;
  item?: TableNode<unknown>;
};

const EMPTY_ROW_ITEM: TableNode<unknown> = { id: '__table_experience_empty__' };

/**
 * Place inside {@link TableBody} — renders a full-width empty row when the table has no visible rows.
 */
const TableExperienceEmptyBody = ({
  visibleRowCount,
  totalRowCount,
  gridColumnEnd,
  item = EMPTY_ROW_ITEM,
  ...emptyCopy
}: TableExperienceEmptyBodyProps): React.ReactElement | null => {
  const reason = getEmptyReason(visibleRowCount, totalRowCount);
  if (!reason) {
    return null;
  }

  return (
    <TableRow item={item} isDisabled testID="table-experience-empty-row">
      <TableCell gridColumnStart={1} gridColumnEnd={gridColumnEnd} textAlign="center">
        <TableExperienceEmpty reason={reason} {...emptyCopy} />
      </TableCell>
    </TableRow>
  );
};

export { TableExperienceEmptyBody };
