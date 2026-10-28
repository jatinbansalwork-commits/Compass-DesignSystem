import React from 'react';
import { TableRow } from '../TableBody';
import type { TableRowProps } from '../types';

const TableExperienceRow = <Item,>(props: TableRowProps<Item>): React.ReactElement => {
  const { item, children, isDisabled, onHover, onClick, hoverActions, testID } = props;
  return (
    <TableRow
      item={item}
      isDisabled={isDisabled}
      onHover={onHover as TableRowProps<unknown>['onHover']}
      onClick={onClick as TableRowProps<unknown>['onClick']}
      hoverActions={hoverActions}
      testID={testID}
    >
      {children}
    </TableRow>
  );
};

export { TableExperienceRow };
