import React from 'react';
import {
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '../../Table';
import type { TableNode } from '../../types';
import type { TransactionTableItem } from './exampleData';
import { formatDate, getTransactionStateColor } from './exampleData';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { IconButton } from '~components/Button/IconButton';
import { EyeIcon, EditIcon, FileTextIcon } from '~components/Icons';

type TransactionColumnDef = {
  key: string;
  header: string;
  sortHeaderKey?: string;
  render: (item: TableNode<TransactionTableItem>) => React.ReactNode;
};

const actionCell = (item: TableNode<TransactionTableItem>): React.ReactElement => (
  <Box display="flex" gap="spacing.3">
    <IconButton isHighlighted icon={EyeIcon} accessibilityLabel={`View ${item.transactionId}`} />
    <IconButton isHighlighted icon={EditIcon} accessibilityLabel={`Edit ${item.transactionId}`} />
    <IconButton
      isHighlighted
      icon={FileTextIcon}
      accessibilityLabel={`View documents for ${item.transactionId}`}
    />
  </Box>
);

const leadingStickyColumns: TransactionColumnDef[] = [
  {
    key: 'actions',
    header: 'Actions',
    render: actionCell,
  },
  {
    key: 'transactionId',
    header: 'Transaction ID',
    sortHeaderKey: 'transactionId',
    render: (item) => <Code size="medium">{item.transactionId}</Code>,
  },
  {
    key: 'companyName',
    header: 'Company Name',
    sortHeaderKey: 'companyName',
    render: (item) => item.companyName,
  },
  {
    key: 'cbpTransactionNumber',
    header: 'CBP Transaction Number',
    render: (item) => item.cbpTransactionNumber,
  },
  {
    key: 'username',
    header: 'Username',
    render: (item) => item.username,
  },
  {
    key: 'transactionState',
    header: 'Transaction State',
    sortHeaderKey: 'transactionState',
    render: (item) => (
      <Badge size="medium" color={getTransactionStateColor(item.transactionState)}>
        {item.transactionState}
      </Badge>
    ),
  },
  {
    key: 'etd',
    header: 'ETD',
    sortHeaderKey: 'etd',
    render: (item) => formatDate(item.etd),
  },
  {
    key: 'vesselName',
    header: 'Vessel Name',
    sortHeaderKey: 'vesselName',
    render: (item) => item.vesselName,
  },
  {
    key: 'filingDate',
    header: 'Filing Date',
    render: (item) => formatDate(item.filingDate),
  },
  {
    key: 'shipmentNumber',
    header: 'Shipment #',
    render: (item) => item.shipmentNumber,
  },
  {
    key: 'mbl',
    header: 'MBL',
    render: (item) => item.mbl,
  },
  {
    key: 'hbl',
    header: 'HBL',
    render: (item) => item.hbl,
  },
  {
    key: 'countryOfExport',
    header: 'Country of Export',
    render: (item) => item.countryOfExport,
  },
];

const trailingActionsColumnOrder = (): TransactionColumnDef[] => [
  ...leadingStickyColumns.filter((column) => column.key !== 'actions'),
  leadingStickyColumns.find((column) => column.key === 'actions')!,
];

const GRID_TEMPLATE =
  '140px 150px 220px 200px 160px 150px 130px 220px 130px 140px 160px 160px 180px';

const renderTransactionTable = (
  tableData: TableNode<TransactionTableItem>[],
  columnDefs: TransactionColumnDef[],
): React.ReactElement => (
  <>
    <TableHeader>
      <TableHeaderRow>
        {columnDefs.map((column) => (
          <TableHeaderCell
            key={column.key}
            headerKey={column.sortHeaderKey}
          >
            {column.header}
          </TableHeaderCell>
        ))}
      </TableHeaderRow>
    </TableHeader>
    <TableBody>
      {tableData.map((row) => (
        <TableRow key={row.id} item={row}>
          {columnDefs.map((column) => (
            <TableCell key={column.key}>{column.render(row)}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </>
);

export {
  leadingStickyColumns,
  trailingActionsColumnOrder,
  GRID_TEMPLATE,
  renderTransactionTable,
};
