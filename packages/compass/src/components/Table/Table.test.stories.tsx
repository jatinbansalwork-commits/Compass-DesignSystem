import React from 'react';
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { Table } from './Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from './TableHeader';
import { TableBody, TableRow, TableCell } from './TableBody';
import { TableToolbar, TableToolbarSearch } from './TableToolbar';
import { Box } from '~components/Box';

type Item = {
  id: string;
  paymentId: string;
  name: string;
  status: string;
};

const nodes: Item[] = [
  { id: '1', paymentId: 'rzp01', name: 'Alpha Corp', status: 'pending' },
  { id: '2', paymentId: 'rzp02', name: 'Beta LLC', status: 'completed' },
  { id: '3', paymentId: 'rzp03', name: 'Gamma Inc', status: 'failed' },
];

const filterFunctions = {
  NAME: (item: Item, value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.name.toLowerCase().includes(needle.toLowerCase());
  },
};

const sortFunctions = {
  STATUS: (array: Item[]) => [...array].sort((a, b) => a.status.localeCompare(b.status)),
};

const onSortChange = fn();
const onSelectionChange = fn();

export const TestHeaderSort: StoryFn = (): React.ReactElement => (
  <Box padding="spacing.4">
    <Table
      data={{ nodes }}
      sortFunctions={sortFunctions}
      onSortChange={onSortChange}
    >
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Payment ID</TableHeaderCell>
              <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} item={row}>
                <TableCell>{row.paymentId}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  </Box>
);

TestHeaderSort.play = async ({ canvasElement }) => {
  onSortChange.mockClear();
  const canvas = within(canvasElement);
  const sortButton = canvas.getByLabelText('Toggle Sort');
  await userEvent.click(sortButton);
  await expect(onSortChange).toHaveBeenCalledWith({ sortKey: 'STATUS', isSortReversed: false });
};

export const TestToolbarSearch: StoryFn = (): React.ReactElement => {
  const [globalFilterValue, setGlobalFilterValue] = React.useState('');

  return (
    <Box padding="spacing.4">
      <Table
        data={{ nodes }}
        filterFunctions={filterFunctions}
        globalFilterValue={globalFilterValue}
        onGlobalFilterValueChange={setGlobalFilterValue}
        toolbar={
          <TableToolbar>
            <TableToolbarSearch placeholder="Search names" accessibilityLabel="Search table" />
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} item={row}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

TestToolbarSearch.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByText('Beta LLC')).toBeInTheDocument();
  const search = canvas.getByLabelText('Search table');
  await userEvent.type(search, 'Alpha');
  await expect(canvas.queryByText('Beta LLC')).not.toBeInTheDocument();
  await expect(canvas.getByText('Alpha Corp')).toBeInTheDocument();
};

export const TestRowSelection: StoryFn = (): React.ReactElement => (
  <Box padding="spacing.4">
    <Table
      data={{ nodes: nodes.slice(0, 2) }}
      selectionType="multiple"
      onSelectionChange={onSelectionChange}
      toolbar={<TableToolbar />}
    >
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Payment ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} item={row}>
                <TableCell>{row.paymentId}</TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  </Box>
);

TestRowSelection.play = async ({ canvasElement }) => {
  onSelectionChange.mockClear();
  const canvas = within(canvasElement);
  const rowCheckboxes = canvas.getAllByRole('checkbox');
  await userEvent.click(rowCheckboxes[1]);
  await expect(onSelectionChange).toHaveBeenCalledWith(
    expect.objectContaining({ selectedIds: ['1'] }),
  );
};

export default {
  title: 'Components/Interaction Tests/Table',
  component: Table,
  parameters: {
    controls: { disable: true },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
