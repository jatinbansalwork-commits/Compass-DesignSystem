import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  CompassDataTable,
  TableExperienceEmptyBody,
  TableExperienceRow,
  useTableExperienceController,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TablePagination,
} from '../index';
import { createTableData, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';

const sourceData = createTableData(30);

const FILTER_COLUMNS = [
  { key: 'PAYMENT_ID', label: 'Payment ID' },
  { key: 'NAME', label: 'Name' },
  { key: 'STATUS', label: 'Status' },
];

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
  STATUS: (array: typeof sourceData.nodes) =>
    [...array].sort((a, b) => a.status.localeCompare(b.status)),
};

const EMPTY_GRID_COLUMN_END = 6;

const meta: Meta = {
  title: 'Components/Table/Experience/CompassDataTable/02 Filters & Selection',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const PrimeParityFeatures: StoryFn = () => {
  const controller = useTableExperienceController({
    data: sourceData,
    filterFunctions,
    sortFunctions,
    filterableColumns: FILTER_COLUMNS,
    filterFieldExtractors: {
      PAYMENT_ID: (row) => row.paymentId,
      NAME: (row) => row.name,
      STATUS: (row) => row.status,
    },
    selectionType: 'multiple',
    features: {
      multiSort: true,
      advancedFilters: true,
      columnToggle: true,
      metaKeySelection: true,
    },
  });

  const visible = new Set(controller.visibleColumnKeys);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="520px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>CompassDataTable — Phase 2</Heading>
        <Text color="surface.text.gray.muted">
          Multi-sort (Shift+click headers), advanced filter popover, column toggle, Ctrl/Cmd+click
          row selection. Same <Code size="medium">filterFunctions</Code> /{' '}
          <Code size="medium">sortFunctions</Code> as your app hook.
        </Text>
      </Box>
      <CompassDataTable
        {...controller.experienceProps}
        experienceApi={controller.experienceProps}
        isHeaderSticky
        toolbarTitle="Payments"
        toolbarSelectedTitle={`${controller.selectedIds.length} selected`}
        pagination={
          <TablePagination defaultPageSize={10} showPageNumberSelector onPageChange={() => undefined} />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {visible.has('PAYMENT_ID') ? (
                  <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                ) : null}
                {visible.has('NAME') ? <TableHeaderCell headerKey="NAME">Name</TableHeaderCell> : null}
                {visible.has('STATUS') ? (
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                ) : null}
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
                <TableExperienceRow key={row.id} item={row}>
                  {visible.has('PAYMENT_ID') ? (
                    <TableCell>
                      <Code size="medium">{row.paymentId}</Code>
                    </TableCell>
                  ) : null}
                  {visible.has('NAME') ? <TableCell>{row.name}</TableCell> : null}
                  {visible.has('STATUS') ? (
                    <TableCell>
                      <Badge size="medium" color={getStatusColor(row.status)}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <Amount value={row.amount} />
                  </TableCell>
                </TableExperienceRow>
              ))}
            </TableBody>
          </>
        )}
      </CompassDataTable>
    </Box>
  );
};

export default meta;
