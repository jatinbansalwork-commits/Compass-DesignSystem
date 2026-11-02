import { applyTableStoryMeta } from '../tableStorybookMeta';
import type { StoryFn, Meta } from '@storybook/react-vite';
import type { TableProps, TableData, TableEditableCellProps } from '../../index';
import {
  Table as TableComponent,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '../../index';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { TableEditableCell, TableEditableDropdownCell } from '~components/Table/TableEditableCell';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { DropdownOverlay } from '~components/Dropdown';

const storyMeta: Meta = {
  title: 'Components/Table/Parts/Editable Cell',
  component: TableEditableCell,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    headerKey: {
      control: {
        disable: true,
      },
    },
    rowDensity: {
      options: ['comfortable', 'normal', 'compact'],
      control: {
        type: 'radio',
      },
      table: {
        category: 'TableProps',
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableEditableCell props here"
          componentName="TableEditableCell"
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

type TableTemplateProps = TableEditableCellProps & { rowDensity: TableProps<never>['rowDensity'] };

const TableTemplate: StoryFn<TableTemplateProps> = ({ rowDensity, ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent showBorderedCells data={data} rowDensity={rowDensity}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Duty amount</TableHeaderCell>
                <TableHeaderCell>HTS code</TableHeaderCell>
                <TableHeaderCell>MOT</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
  // AUDIT: key={index} — may cause reconciliation issues if list reorders
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableEditableCell
                    {...args}
                    accessibilityLabel="Amount"
                    defaultValue={`${tableItem.amount}`}
                  />
                  <TableEditableCell
                    accessibilityLabel="Amount"
                    validationState="error"
                    placeholder="Account number"
                    errorText="Account number is invalid"
                  />
                  <TableEditableDropdownCell selectionType="multiple">
                    <AutoComplete
                      accessibilityLabel="Method"
                      validationState={args.validationState}
                      errorText="Invalid Method"
                      successText="Valid Method"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Mumbai" value="mumbai" />
                        <ActionListItem title="Pune" value="pune" />
                        <ActionListItem title="Bangalore" value="bangalore" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                  <TableCell>
                    {tableItem.date?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableEditableDropdownCell>
                    <SelectInput
                      validationState={args.validationState}
                      accessibilityLabel="Status"
                      errorText="Invalid Status"
                      successText="Valid Status"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Pending" value="pending" />
                        <ActionListItem title="Released" value="completed" />
                        <ActionListItem title="Failed" value="failed" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableEditableCellStory = TableTemplate.bind({});
TableEditableCellStory.args = {
  rowDensity: 'normal',
};
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableEditableCellStory.storyName = 'TableEditableCell';
