import React from 'react';
import { TableBody, TableRow, TableCell } from './TableBody';
import { TableHeader, TableHeaderRow, TableHeaderCell } from './TableHeader';
import type { TableColumnConfig, TableNode } from './types';

/** Default JSX when `Table` is driven by `columns` config. */
const buildTableFromColumnConfig = <Item,>(
  columns: TableColumnConfig<Item>[],
  tableData: TableNode<Item>[],
): React.ReactElement => (
  <>
    <TableHeader>
      <TableHeaderRow>
        {columns.map((column) => (
          <TableHeaderCell key={column.key} headerKey={column.headerKey ?? column.key}>
            {column.header}
          </TableHeaderCell>
        ))}
      </TableHeaderRow>
    </TableHeader>
    <TableBody>
      {tableData.map((row, rowIndex) => (
        <TableRow key={row.id} item={row}>
          {columns.map((column) => (
            <TableCell key={column.key} textAlign={column.textAlign}>
              {column.render(row, rowIndex)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </>
);

const gridTemplateColumnsFromConfig = <Item,>(columns: TableColumnConfig<Item>[]): string =>
  columns.map((column) => column.width ?? 'minmax(100px, 1fr)').join(' ');

export { buildTableFromColumnConfig, gridTemplateColumnsFromConfig };
