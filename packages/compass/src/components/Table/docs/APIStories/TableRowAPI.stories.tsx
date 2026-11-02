import { applyTableStoryMeta } from '../tableStorybookMeta';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { TableData } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Link } from '~components/Link';
import { CopyIcon, TrashIcon } from '~components/Icons';
import { IconButton } from '~components/Button/IconButton';

const storyMeta: Meta = {
  title: 'Components/Table/Parts/Row',
  component: TableRow,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    item: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableRow props here"
          componentName="TableRow"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
};

applyTableStoryMeta(storyMeta);
export default storyMeta;

const nodes: Item[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
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

const TableTemplate: StoryFn<typeof TableRow> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent data={data} selectionType="multiple">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Duty amount</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => {
                return (
                  <TableRow
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                    key={index}
                    {...args}
                    item={tableItem}
                    hoverActions={
                      <>
                        <IconButton
                          accessibilityLabel="Copy"
                          isHighlighted
                          icon={CopyIcon}
                          onClick={() => console.log('copy', tableItem)}
                        />
                        <IconButton
                          accessibilityLabel="Delete"
                          isHighlighted
                          icon={TrashIcon}
                          onClick={() => console.log('delete', tableItem)}
                        />
                      </>
                    }
                  >
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap="spacing.3">
                        <Link
                          onClick={() => console.log('copy')}
                          isDisabled={args.isDisabled}
                          variant="button"
                          icon={CopyIcon}
                        >
                          Copy
                        </Link>
                        <Link
                          onClick={() => console.log('delete')}
                          isDisabled={args.isDisabled}
                          variant="button"
                          icon={TrashIcon}
                        >
                          Delete
                        </Link>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableRowStory = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableRowStory.storyName = 'TableRow';
