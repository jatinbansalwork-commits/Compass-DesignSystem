import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  CompassDataTable,
  TableExperienceEmptyBody,
  useTableExperienceController,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '../index';
import { createTableData, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';

const sourceData = createTableData(24);

const filterFunctions = {
  PAYMENT_ID: (item: (typeof sourceData.nodes)[number], value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.paymentId.toLowerCase().includes(needle.toLowerCase());
  },
  NAME: (item: (typeof sourceData.nodes)[number], value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.name.toLowerCase().includes(needle.toLowerCase());
  },
  STATUS: (item: (typeof sourceData.nodes)[number], value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.status.toLowerCase().includes(needle.toLowerCase());
  },
};

const sortFunctions = {
  PAYMENT_ID: (array: typeof sourceData.nodes) =>
    [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
  NAME: (array: typeof sourceData.nodes) => [...array].sort((a, b) => a.name.localeCompare(b.name)),
};

const LEAF_COLUMN_COUNT = 4;
/** Checkbox column + four data columns when selection is enabled. */
const EMPTY_GRID_COLUMN_END = LEAF_COLUMN_COUNT + 2;

const meta: Meta = {
  title: 'Components/Table/Experience/CompassDataTable/01 Toolbar & Export',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const PrimeStyleShell: StoryFn = () => {
  const controller = useTableExperienceController({
    data: sourceData,
    filterFunctions,
    sortFunctions,
    initialSort: { sortKey: 'NAME', direction: 'asc' },
    selectionType: 'multiple',
  });

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="480px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>CompassDataTable — Phase 1</Heading>
        <Text color="surface.text.gray.muted">
          Same <Code size="medium">filterFunctions</Code> / server-ready pagination rules; Prime-like
          toolbar (global search + export) via the experience add-on.
        </Text>
      </Box>
      <CompassDataTable
        {...controller.experienceProps}
        experienceApi={controller.experienceProps}
        isHeaderSticky
        toolbarTitle="Payments"
        toolbarSelectedTitle={`${controller.selectedIds.length} selected`}
        exportFileName="payments"
        exportColumns={[
          { header: 'Payment ID', getValue: (row) => row.paymentId },
          { header: 'Name', getValue: (row) => row.name },
          { header: 'Status', getValue: (row) => row.status },
          { header: 'Amount', getValue: (row) => String(row.amount) },
        ]}
        pagination={
          <TablePagination defaultPageSize={10} showPageNumberSelector onPageChange={() => undefined} />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              <TableExperienceEmptyBody
                visibleRowCount={tableData.length}
                totalRowCount={sourceData.nodes.length}
                gridColumnEnd={EMPTY_GRID_COLUMN_END}
              />
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
                  <TableCell>
                    <Amount value={row.amount} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </CompassDataTable>
    </Box>
  );
};

export default meta;
