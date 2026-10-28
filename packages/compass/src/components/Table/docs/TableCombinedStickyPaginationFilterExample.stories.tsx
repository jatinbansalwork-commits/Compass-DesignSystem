import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarSearch,
  TablePagination,
} from '../../Table';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

const allRows = createTableData(80);

const filterFunctions = {
  PAYMENT_ID: (item: (typeof allRows.nodes)[number], value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.paymentId.toLowerCase().includes(needle.toLowerCase());
  },
  NAME: (item: (typeof allRows.nodes)[number], value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.name.toLowerCase().includes(needle.toLowerCase());
  },
};

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Combined Features',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

/** Sticky layout + header filter row + toolbar search + client pagination. */
export const StickyFilterAndPagination = (): React.ReactElement => {
  const [globalFilter, setGlobalFilter] = React.useState('');

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="480px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Sticky column + header, search filter, pagination</Heading>
        <Text>
          Wide dataset with horizontal scroll, first column frozen, per-column header filters, global
          toolbar search, and pagination.
        </Text>
      </Box>
      <Table
        data={allRows}
        filterFunctions={filterFunctions}
        globalFilterValue={globalFilter}
        onGlobalFilterValueChange={setGlobalFilter}
        isHeaderSticky
        isFirstColumnSticky
        height="420px"
        gridTemplateColumns="minmax(140px, 160px) minmax(120px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(160px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr)"
        toolbar={
          <TableToolbar title="Payments">
            <TableToolbarSearch placeholder="Search all columns" />
          </TableToolbar>
        }
        pagination={
          <TablePagination
            defaultPageSize={10}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={() => undefined}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem) => (
                <TableRow key={tableItem.id} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>{tableItem.account}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export default TableMeta;
