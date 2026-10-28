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
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '../../Table';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

const tableData = createTableData(15);

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Footer Totals',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const ColumnAggregateFooter = (): React.ReactElement => {
  const totalAmount = tableData.nodes.reduce((sum, row) => sum + row.amount, 0);
  const completedCount = tableData.nodes.filter((row) => row.status === 'Completed').length;
  const averageAmount = totalAmount / tableData.nodes.length;

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Footer totals row</Heading>
        <Text>
          Business-style summary: sum and average of amounts, count of completed payments — built
          with `TableFooter` / `TableFooterCell`, not a separate component.
        </Text>
      </Box>
      <Table data={tableData} isFooterSticky height="400px">
        {(rows) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} item={row}>
                  <TableCell>
                    <Code size="medium">{row.paymentId}</Code>
                  </TableCell>
                  <TableCell>{formatDate(row.date)}</TableCell>
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
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Totals ({tableData.nodes.length} rows)</TableFooterCell>
                <TableFooterCell>—</TableFooterCell>
                <TableFooterCell>{completedCount} completed</TableFooterCell>
                <TableFooterCell>
                  <Box display="flex" flexDirection="column" gap="spacing.1">
                    <Text size="small" weight="semibold">
                      Sum
                    </Text>
                    <Amount value={totalAmount} />
                    <Text size="small" weight="semibold">
                      Average
                    </Text>
                    <Amount value={Number(averageAmount.toFixed(2))} />
                  </Box>
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </Box>
  );
};

export default TableMeta;
