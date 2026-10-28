import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { Table, TablePagination } from '../index';
import type { TableColumnConfig } from '../types';
import { createTableData, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';

const data = createTableData(20);

type Row = (typeof data.nodes)[number];

const columns: TableColumnConfig<Row>[] = [
  {
    key: 'id',
    header: 'Payment ID',
    headerKey: 'PAYMENT_ID',
    width: 'minmax(140px, 180px)',
    render: (row) => row.paymentId,
  },
  {
    key: 'name',
    header: 'Name',
    headerKey: 'NAME',
    render: (row) => row.name,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge size="medium" color={getStatusColor(row.status)}>
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'amount',
    header: 'Amount',
    textAlign: 'right',
    render: (row) => <Amount value={row.amount} />,
  },
];

const meta: Meta = {
  title: 'Components/Table/Features/Columns Config',
  tags: ['autodocs'],
  parameters: { chromatic: { disableSnapshot: true } },
};

export const TableDrivenByColumnsConfig = (): React.ReactElement => (
  <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="400px">
    <Box paddingBottom="spacing.4">
      <Heading>Declarative columns</Heading>
      <Text>
        Pass <Code size="medium">columns</Code> instead of a <Code size="medium">children</Code>{' '}
        render function — grid widths come from each column&apos;s <Code size="medium">width</Code>.
      </Text>
    </Box>
    <Table
      data={data}
      columns={columns}
      pagination={<TablePagination defaultPageSize={5} showPageNumberSelector />}
    />
  </Box>
);

export default meta;
