import { applyTableStoryMeta } from '../tableStorybookMeta';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { TableData } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TablePagination } from '../../TablePagination';
import { TableToolbarActions, TableToolbar } from '../../TableToolbar';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { useTheme } from '~components/KdesignProvider';

const storyMeta: Meta = {
  title: 'Components/Table/Parts/Toolbar',
  component: TableToolbar,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableToolbar props here"
          componentName="TableToolbar"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
};

applyTableStoryMeta(storyMeta);
export default storyMeta;

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
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

const TableTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent
        data={data}
        selectionType="multiple"
        onSelectionChange={({ values }) => console.log('Selected Rows:', values)}
        sortFunctions={{
          ID: (array) => array.sort((a, b) => Number(a.id) - Number(b.id)),
          AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
          ACCOUNT: (array) => array.sort((a, b) => Number(a.account) - Number(b.account)),
          SHIPMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
          DATE: (array) => array.sort((a, b) => a.date.getTime() - b.date.getTime()),
          METHOD: (array) => array.sort((a, b) => a.method.localeCompare(b.method)),
          STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
        }}
        onSortChange={({ sortKey, isSortReversed }) =>
          console.log('Sort Key:', sortKey, 'Sort Reversed:', isSortReversed)
        }
        toolbar={
          <TableToolbar {...args}>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>File entry</Button>
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
                <TableHeaderCell headerKey="SHIPMENT_ID">Shipment ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Duty amount</TableHeaderCell>
                <TableHeaderCell headerKey="ACCOUNT">HTS code</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell headerKey="METHOD">MOT</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
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
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableToolbarStory = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableToolbarStory.storyName = 'TableToolbar';
