import React from 'react';
import { TableRow } from '../TableBody';
import BaseBox from '~components/Box/BaseBox';
import type { TableRowProps } from '../types';
import { useTableExperienceKeyboardContext } from './TableExperienceKeyboardContext';

type TableExperienceRowProps<Item> = TableRowProps<Item>;

/** {@link TableRow} wrapped for {@link TableExperienceSelectionRoot} hit-testing. */
const TableExperienceRow = <Item,>({
  item,
  children,
  ...rest
}: TableExperienceRowProps<Item>): React.ReactElement => {
  const { focusedRowId } = useTableExperienceKeyboardContext();
  const isKeyboardFocused =
    focusedRowId != null && String(focusedRowId) === String(item.id);

  return (
    <BaseBox
      data-table-experience-row-id={String(item.id)}
      data-table-experience-row-keyboard-focused={isKeyboardFocused ? '' : undefined}
      display="contents"
    >
      <TableRow item={item} {...rest}>
        {children}
      </TableRow>
    </BaseBox>
  );
};

export { TableExperienceRow };
