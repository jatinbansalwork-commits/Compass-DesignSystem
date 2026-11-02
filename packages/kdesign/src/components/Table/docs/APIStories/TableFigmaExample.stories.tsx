import { applyTableRecipeMeta } from '../tableStorybookMeta';
import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { TableData, TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableToolbarActions, TableToolbar } from '../../TableToolbar';
import { TablePagination } from '../../TablePagination';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { KdesignProvider } from '~components/KdesignProvider';
import { kdesignTheme } from '~tokens/theme';

const storyMeta: Meta<TableProps<unknown>> = {
  title: 'Components/Table/Features/Design Reference',
  component: TableComponent,
};

applyTableRecipeMeta(storyMeta);
export default storyMeta;

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  method: string;
  account: string;
};
const nodes: Item[] = [
  {
    id: '1',
    paymentId: 'KX-001',
    amount: 1000,
    status: 'Released',
    date: new Date(2024, 0, 15),
    method: 'Ocean',
    account: '1234567890',
  },
  {
    id: '2',
    paymentId: 'KX-002',
    amount: 2500,
    status: 'Exam hold',
    date: new Date(2024, 0, 16),
    method: 'Air',
    account: '0987654321',
  },
  {
    id: '3',
    paymentId: 'KX-003',
    amount: 500,
    status: 'Rejected',
    date: new Date(2024, 0, 17),
    method: 'Truck',
    account: '1122334455',
  },
  {
    id: '4',
    paymentId: 'KX-004',
    amount: 3000,
    status: 'Released',
    date: new Date(2024, 0, 18),
    method: 'Ocean',
    account: '5566778899',
  },
  {
    id: '5',
    paymentId: 'KX-005',
    amount: 750,
    status: 'Exam hold',
    date: new Date(2024, 0, 19),
    method: 'Air',
    account: '9988776655',
  },
  {
    id: '6',
    paymentId: 'KX-006',
    amount: 1200,
    status: 'Released',
    date: new Date(2024, 0, 20),
    method: 'Truck',
    account: '4433221100',
  },
  {
    id: '7',
    paymentId: 'KX-007',
    amount: 800,
    status: 'Rejected',
    date: new Date(2024, 0, 21),
    method: 'Ocean',
    account: '1357924680',
  },
  {
    id: '8',
    paymentId: 'KX-008',
    amount: 1500,
    status: 'Released',
    date: new Date(2024, 0, 22),
    method: 'Air',
    account: '2468013579',
  },
];

const data: TableData<Item> = {
  nodes,
};

const StripedTableContent = (): React.ReactElement => (
  <Box
    backgroundColor="surface.background.gray.moderate"
    padding="spacing.8"
    overflow="auto"
    minHeight="400px"
  >
    <TableComponent
      data={data}
      showStripedRows
      selectionType="multiple"
      onSelectionChange={({ selectedIds }) => console.log('Selected:', selectedIds)}
      toolbar={
        <TableToolbar title="Showing 1-8 Items">
          <TableToolbarActions>
            <Button variant="secondary" marginRight="spacing.3">
              Export
            </Button>
            <Button>File entry</Button>
          </TableToolbarActions>
        </TableToolbar>
      }
      pagination={
        <TablePagination
          onPageChange={console.log}
          defaultPageSize={10}
          onPageSizeChange={console.log}
          showPageSizePicker
          showPageNumberSelector
        />
      }
    >
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Shipment ID</TableHeaderCell>
              <TableHeaderCell>Duty amount</TableHeaderCell>
              <TableHeaderCell>HTS code</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>MOT</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((tableItem) => (
              <TableRow key={tableItem.id} item={tableItem}>
                <TableCell>
                  <Code size="medium">{tableItem.paymentId}</Code>
                </TableCell>
                <TableCell>
                  <Amount value={tableItem.amount} />
                </TableCell>
                <TableCell>{tableItem.account}</TableCell>
                <TableCell>
                  {tableItem.date?.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </TableCell>
                <TableCell>{tableItem.method}</TableCell>
                <TableCell>
                  <Badge
                    size="medium"
                    color={
                      tableItem.status === 'Released'
                        ? 'positive'
                        : tableItem.status === 'Exam hold'
                        ? 'notice'
                        : tableItem.status === 'Rejected'
                        ? 'negative'
                        : 'neutral'
                    }
                  >
                    {tableItem.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </TableComponent>
  </Box>
);

export const TableFigmaExample: StoryFn<typeof TableComponent> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.8">
    <StripedTableContent />
    <KdesignProvider themeTokens={kdesignTheme} colorScheme="dark">
      <StripedTableContent />
    </KdesignProvider>
  </Box>
);

TableFigmaExample.storyName = 'TableFigmaExample';
