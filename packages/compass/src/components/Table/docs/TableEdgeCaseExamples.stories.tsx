import React, { useMemo, useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableToolbar,
  TableToolbarSearch,
  TableExperienceEmptyBody,
} from '../index';
import { createTableData } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { getStatusColor } from './exampleData';

const allPayments = createTableData(48);
const emptyPayments = createTableData(0);

const sortFunctions = {
  PAYMENT_ID: (array: typeof allPayments.nodes) =>
    [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
};

const filterFunctions = {
  NAME: (item: (typeof allPayments.nodes)[number], value: string) =>
    item.name.toLowerCase().includes(value.toLowerCase()),
};

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Edge Cases',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

/** Selection ids persist when changing pages (client pagination). */
export const SelectionAcrossPages = (): React.ReactElement => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="480px">
      <Box paddingBottom="spacing.4">
        <Heading>Selection across pages</Heading>
        <Text>
          Select rows on page 1, change page — selected ids remain ({selectedIds.length} selected).
          Use controlled <Code size="medium">selectedIds</Code> for server pagination too.
        </Text>
      </Box>
      <Table
        data={allPayments}
        selectionType="multiple"
        selectedIds={selectedIds}
        onSelectionChange={({ selectedIds: ids }) => setSelectedIds(ids)}
        pagination={<TablePagination defaultPageSize={5} showPageNumberSelector />}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} item={row}>
                  <TableCell>
                    <Code size="medium">{row.paymentId}</Code>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(row.status)}>
                      {row.status}
                    </Badge>
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

const emptyTableBody = (
  tableData: (typeof allPayments.nodes)[number][],
  totalRowCount: number,
): React.ReactElement => (
  <>
    <TableHeader>
      <TableHeaderRow>
        <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
        <TableHeaderCell>Amount</TableHeaderCell>
      </TableHeaderRow>
    </TableHeader>
    <TableBody>
      <TableExperienceEmptyBody
        visibleRowCount={tableData.length}
        totalRowCount={totalRowCount}
        gridColumnEnd={3}
      />
      {tableData.map((row) => (
        <TableRow key={row.id} item={row}>
          <TableCell>{row.name}</TableCell>
          <TableCell>
            <Amount value={row.amount} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </>
);

export const NoDataAtAll = (): React.ReactElement => (
  <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="320px">
    <Box paddingBottom="spacing.4">
      <Heading>No data at all</Heading>
      <Text>Empty `data.nodes` — use experience empty body for copy.</Text>
    </Box>
    <Table data={emptyPayments}>{(tableData) => emptyTableBody(tableData, 0)}</Table>
  </Box>
);

export const NoResultsAfterFilter = (): React.ReactElement => (
  <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="320px">
    <Box paddingBottom="spacing.4">
      <Heading>No results after filter</Heading>
      <Text>Data exists but filters remove every row.</Text>
    </Box>
    <Table
      data={allPayments}
      filterFunctions={filterFunctions}
      columnFilterValues={{ NAME: '___no-match___' }}
      toolbar={
        <TableToolbar title="Payments">
          <TableToolbarSearch />
        </TableToolbar>
      }
    >
      {(tableData) => emptyTableBody(tableData, allPayments.nodes.length)}
    </Table>
  </Box>
);

export const WideDatasetImplicitWidths = (): React.ReactElement => {
  const wideData = useMemo(() => createTableData(12), []);
  const manyColumns = Array.from({ length: 14 }, (_, index) => `Col ${index + 1}`);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="360px">
      <Box paddingBottom="spacing.4">
        <Heading>Wide dataset</Heading>
        <Text>
          No explicit <Code size="medium">gridTemplateColumns</Code> — defaults to equal min tracks
          and horizontal scroll.
        </Text>
      </Box>
      <Table data={wideData} isHeaderSticky height="280px">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {manyColumns.map((label) => (
                  <TableHeaderCell key={label}>{label}</TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} item={row}>
                  {manyColumns.map((label) => (
                    <TableCell key={label}>
                      {label === 'Col 1' ? row.paymentId : row.name.slice(0, 8)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export const MultiColumnSortWithShift = (): React.ReactElement => {
  const data = createTableData(15);
  const fns = {
    STATUS: (array: typeof data.nodes) => [...array].sort((a, b) => a.status.localeCompare(b.status)),
    NAME: (array: typeof data.nodes) => [...array].sort((a, b) => a.name.localeCompare(b.name)),
  };

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="400px">
      <Box paddingBottom="spacing.4">
        <Heading>Multi-column sort</Heading>
        <Text>Click a header to sort; Shift+click another header to stack sort priority.</Text>
      </Box>
      <Table data={data} sortFunctions={fns} initialSort={{ sortKey: 'STATUS', direction: 'asc' }}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} item={row}>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Amount value={row.amount} />
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
