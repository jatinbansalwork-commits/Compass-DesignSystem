import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  CompassDataTable,
  TableExperienceEmptyBody,
  TableExperienceRow,
  TableExperienceResizableHeaderCell,
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
  { key: 'PAYMENT_ID', label: 'Payment ID', defaultWidthPx: 160, minWidthPx: 100 },
  { key: 'NAME', label: 'Name', defaultWidthPx: 180, minWidthPx: 120 },
  { key: 'STATUS', label: 'Status', defaultWidthPx: 140, minWidthPx: 100 },
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
  title: 'Components/Table/Experience/CompassDataTable/03 Layout & Keyboard',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const LayoutAndKeyboard: StoryFn = () => {
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
      columnReorder: true,
      columnResize: true,
      rowKeyboardNavigation: true,
      metaKeySelection: true,
    },
  });

  const api = controller.experienceProps;
  const orderedKeys = api.experienceOrderedVisibleColumnKeys;

  const renderHeaderCell = (key: (typeof FILTER_COLUMNS)[number]['key'], label: string) => {
    const metaColumn = FILTER_COLUMNS.find((column) => column.key === key);
    const widthPx =
      api.experienceColumnWidths[key] ?? metaColumn?.defaultWidthPx ?? 140;
    return (
      <TableHeaderCell headerKey={key}>
        <TableExperienceResizableHeaderCell
          columnKey={key}
          widthPx={widthPx}
          minWidthPx={metaColumn?.minWidthPx}
          onWidthChange={api.setExperienceColumnWidth}
        >
          {label}
        </TableExperienceResizableHeaderCell>
      </TableHeaderCell>
    );
  };

  const renderBodyCell = (key: string, row: (typeof sourceData.nodes)[number]) => {
    if (key === 'PAYMENT_ID') {
      return (
        <TableCell>
          <Code size="medium">{row.paymentId}</Code>
        </TableCell>
      );
    }
    if (key === 'NAME') {
      return <TableCell>{row.name}</TableCell>;
    }
    if (key === 'STATUS') {
      return (
        <TableCell>
          <Badge size="medium" color={getStatusColor(row.status)}>
            {row.status}
          </Badge>
        </TableCell>
      );
    }
    return null;
  };

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="520px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>CompassDataTable — Phase 3</Heading>
        <Text color="surface.text.gray.muted">
          Column reorder + resize, keyboard row navigation (focus the table area, then Arrow Up/Down
          and Space), and no inline header filter row when advanced filters are on.
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
                  {orderedKeys.map((key) => {
                    const column = FILTER_COLUMNS.find((item) => item.key === key);
                    return column ? renderHeaderCell(column.key, column.label) : null;
                  })}
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
                    {orderedKeys.map((key) => (
                      <React.Fragment key={key}>{renderBodyCell(key, row)}</React.Fragment>
                    ))}
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
