import { applyTableStoryMeta } from './tableStorybookMeta';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { TableData, TableProps } from '../types';
import {
  Table as TableComponent,
  TableEditableCell,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
} from '../../Table';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { CheckIcon, CloseIcon } from '~components/Icons';
import { TableHeaderTitleWithInfo } from './TableHeaderTitleWithInfo';

const storyMeta: Meta<TableProps<unknown>> = {
  title: 'Components/Table',
  component: TableComponent,
  args: {
    isFirstColumnSticky: true,
  },
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Overview and props playground for `Table`. See `docs/STORYBOOK_STANDARDS.md` for controls, actions, a11y, and interaction conventions. Use **Controls** for layout/sticky/filters; **Actions** logs callbacks; run **Accessibility** and **Interactions** panels.',
      },
      page: () => (
        <StoryPageWrapper
          componentDescription="A table component helps in displaying data in a grid format, through rows and columns of cells. Table facilitates data organisation and allow users to: scan, sort, compare, and take action on large amounts of data."
          componentName="Table"
        />
      ),
    },
  },
};

applyTableStoryMeta(storyMeta);
export default storyMeta;

const nodes: Item[] = [
  ...Array.from({ length: 100 }, (_, i) => ({
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
  return (
    <Box padding="spacing.5" overflow="auto" minHeight="400px">
      <TableComponent
        data={data}
        defaultSelectedIds={['1', '3']}
        {...args}
        onSelectionChange={args.onSelectionChange}
        onSortChange={args.onSortChange}
        toolbar={
          <TableToolbar title="Showing 1-10 [Items]" selectedTitle="Showing 1-10 [Items]">
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.2">
                Export
              </Button>
              <Button>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        sortFunctions={{
          ID: (array) => array.sort((a, b) => Number(a.id) - Number(b.id)),
          AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
          SHIPMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
          DATE: (array) => array.sort((a, b) => a.date.getTime() - b.date.getTime()),
          STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
        }}
        pagination={
          <TablePagination
            defaultPageSize={10}
            showPageSizePicker
            showPageNumberSelector
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="SHIPMENT_ID">
                  <TableHeaderTitleWithInfo
                    title="Shipment ID"
                    infoTooltip="KlearNow shipment identifier (KX-*). Used across clearance, billing, and ACE matching."
                    infoAccessibilityLabel="About Shipment ID"
                  />
                </TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Duty amount</TableHeaderCell>
                <TableHeaderCell headerKey="ACCOUNT">HTS code</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell headerKey="METHOD">MOT</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                  key={index}
                  item={tableItem}
                  hoverActions={
                    <>
                      <Button variant="tertiary" size="xsmall">
                        View Details
                      </Button>
                      <IconButton
                        icon={CheckIcon}
                        isHighlighted
                        accessibilityLabel="Approve"
                        onClick={() => {
                          console.log('Approved', tableItem.id);
                        }}
                      />
                      <IconButton
                        icon={CloseIcon}
                        isHighlighted
                        accessibilityLabel="Reject"
                        onClick={() => {
                          console.log('Rejected', tableItem.id);
                        }}
                      />
                    </>
                  }
                  onClick={() => {
                    console.log('where');
                  }}
                >
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableEditableCell
                    accessibilityLabel="Amount"
                    placeholder="Enter text"
                    successText="Amount is valid"
                  />
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
                          : 'primary'
                      }
                    >
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                {args.selectionType === 'multiple' ? <TableFooterCell>-</TableFooterCell> : null}
                <TableFooterCell>
                  <Amount value={10} />
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Basic Table';

Table.play = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('table')).toBeVisible();
  const sortButtons = canvas.queryAllByLabelText('Toggle Sort');
  if (sortButtons.length > 0 && args.onSortChange) {
    await userEvent.click(sortButtons[0]);
    await waitFor(() => expect(args.onSortChange).toHaveBeenCalled());
  }
};
