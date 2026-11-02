import { applyTableStoryMeta } from '../tableStorybookMeta';
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { TableData } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableRow, TableCell, TableVirtualizedWrapper, TableBody } from '../../TableBody';
import { TableToolbarActions, TableToolbar } from '../../TableToolbar';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';

const storyMeta: Meta = {
  title: 'Components/Table/Features/Virtualized',
  component: TableVirtualizedWrapper,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableVirtulized props here"
          componentName="TableVirtulized"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
};

applyTableStoryMeta(storyMeta);
export default storyMeta;

const nodes: Item[] = [
  ...Array.from({ length: 5000 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `KX-${String(Math.floor(Math.random() * 900000 + 100000)).padStart(6, '0')}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Released', 'Exam hold', 'Rejected', 'Pending CBP review'][Math.floor(Math.random() * 4)],
    date: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Formal entry', 'Consumption entry', 'Temporary import'][Math.floor(Math.random() * 3)],
    method: ['Ocean', 'Air', 'Truck'][Math.floor(Math.random() * 3)],
    bank: ['Meridian Customs', 'Pacific Rim Brokerage', 'Harborline Brokers'][Math.floor(Math.random() * 3)],
    account: ['8471.30.0100', '2933.99.8200', '8703.23.0190', '4011.10.1000'][Math.floor(Math.random() * 4)],
    name: ['Schlumberger USA Inc.', 'BASF Agricultural Solutions', 'Pacific Rim Trading Co.', 'Meridian Customs Brokers'][Math.floor(Math.random() * 4)],
  })),
];

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: string;
  bank: string;
  account: string;
  name: string;
};
const data: TableData<Item> = {
  nodes,
};

const TableTemplate: StoryFn<typeof TableComponent> = () => {
  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="700px">
      <TableComponent
        data={data}
        height="500px"
        rowDensity="comfortable"
        selectionType="multiple"
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3">
                Export
              </Button>
              <Button>File entry</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {() => (
          <TableVirtualizedWrapper>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Duty amount</TableHeaderCell>
                <TableHeaderCell>HTS code</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>MOT</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {(tableItem: Item, index) => (
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                <TableRow key={index} item={tableItem}>
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
                          : 'default'
                      }
                    >
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableVirtualizedWrapper>
        )}
      </TableComponent>
    </Box>
  );
};

export const VirtualizedTable = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
VirtualizedTable.storyName = 'VirtualizedTable';
