import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { within, userEvent, expect } from 'storybook/test';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '../../Table';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

const data = createTableData(25);

const sortFunctions = {
  PAYMENT_ID: (array: typeof data.nodes) =>
    [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
  AMOUNT: (array: typeof data.nodes) => [...array].sort((a, b) => a.amount - b.amount),
};

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Keyboard Navigation',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const KeyboardWalkthrough = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="420px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Keyboard focus walkthrough</Heading>
        <Text>
          Tab moves through sortable column headers and pagination controls. This story does not
          implement full grid roving tabindex (see Tier B in the Table use-case audit).
        </Text>
      </Box>
      <Table
        data={data}
        sortFunctions={sortFunctions}
        pagination={
          <TablePagination defaultPageSize={5} showPageNumberSelector onPageChange={() => undefined} />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id} item={row}>
                  <TableCell>
                    <Code size="medium">{row.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={row.amount} />
                  </TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
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

KeyboardWalkthrough.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.tab();
  const sortButtons = canvas.getAllByRole('button');
  await expect(sortButtons.length).toBeGreaterThan(0);
  await expect(sortButtons[0]).toHaveFocus();
};

export default TableMeta;
