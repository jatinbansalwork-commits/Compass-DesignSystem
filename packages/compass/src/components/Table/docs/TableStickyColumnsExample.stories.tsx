import React from 'react';
import type { Meta } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  Table,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarActions,
  TablePagination,
} from '../../Table';
import { createTransactionTableData } from './exampleData';
import type { TransactionTableItem } from './exampleData';
import {
  GRID_TEMPLATE,
  leadingStickyColumns,
  renderTransactionTable,
  trailingActionsColumnOrder,
} from './stickyColumnsStoryContent';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Button } from '~components/Button';
import { useTheme } from '~components/CompassProvider';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Sticky Columns',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

const stickyColumnsExampleData = createTransactionTableData(50);

const filterFunctions = {
  companyName: (item: TransactionTableItem, value: string) =>
    item.companyName.toLowerCase().includes(value.toLowerCase()),
  vesselName: (item: TransactionTableItem, value: string) =>
    item.vesselName.toLowerCase().includes(value.toLowerCase()),
  transactionState: (item: TransactionTableItem, value: string) =>
    item.transactionState.toLowerCase().includes(value.toLowerCase()),
};

const sortFunctions = {
  transactionId: (array: TransactionTableItem[]) =>
    [...array].sort((a, b) => a.transactionId.localeCompare(b.transactionId)),
  companyName: (array: TransactionTableItem[]) =>
    [...array].sort((a, b) => a.companyName.localeCompare(b.companyName)),
  transactionState: (array: TransactionTableItem[]) =>
    [...array].sort((a, b) => a.transactionState.localeCompare(b.transactionState)),
  etd: (array: TransactionTableItem[]) =>
    [...array].sort((a, b) => a.etd.getTime() - b.etd.getTime()),
  vesselName: (array: TransactionTableItem[]) =>
    [...array].sort((a, b) => a.vesselName.localeCompare(b.vesselName)),
};

export const StickyColumns = (): React.ReactElement => {
  const [selectedCount, setSelectedCount] = React.useState(0);
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Sticky Columns</Heading>
        <Text>
          Composable JSX table with three leading frozen columns, sorting, toolbar search,
          column filters, selection, and pagination.
        </Text>
      </Box>
      <Table
        data={stickyColumnsExampleData}
        gridTemplateColumns={GRID_TEMPLATE}
        stickyColumnCount={3}
        stickyColumnWidths={['140px', '150px', '220px']}
        isHeaderSticky
        sortFunctions={sortFunctions}
        onSortChange={action('onSortChange')}
        filterFunctions={filterFunctions}
        onGlobalFilterValueChange={action('onGlobalFilterValueChange')}
        selectionType="multiple"
        onSelectionChange={({ selectedIds }) => setSelectedCount(selectedIds.length)}
        toolbar={
          <TableToolbar
            title="Showing Transactions"
            selectedTitle={`${selectedCount} Transaction${selectedCount > 1 ? 's' : ''} Selected`}
          >
            <TableToolbarActions>
              <Button size="small" variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button size="small" isFullWidth={onMobile}>
                Mark as Reviewed
              </Button>
            </TableToolbarActions>
            <TableToolbarSearch placeholder="Search company, vessel, or state" />
          </TableToolbar>
        }
        pagination={
          <TablePagination
            defaultPageSize={10}
            pageSizeOptions={[10, 20, 50]}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={action('onPageChange')}
            onPageSizeChange={action('onPageSizeChange')}
            showLabel
          />
        }
      >
        {(tableData) => renderTransactionTable(tableData, leadingStickyColumns)}
      </Table>
    </Box>
  );
};

export const TrailingStickyColumns = (): React.ReactElement => {
  const columnDefs = trailingActionsColumnOrder();
  const gridWithTrailingActions =
    '150px 220px 200px 160px 150px 130px 220px 130px 140px 160px 160px 180px 140px';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Trailing Sticky Columns</Heading>
        <Text>
          Leading sticky columns plus a trailing Actions column frozen on the right edge.
        </Text>
      </Box>
      <Table
        data={stickyColumnsExampleData}
        gridTemplateColumns={gridWithTrailingActions}
        stickyColumnCount={2}
        stickyColumnWidths={['150px', '220px']}
        trailingStickyColumnCount={1}
        trailingStickyColumnWidths={['140px']}
        isHeaderSticky
        sortFunctions={sortFunctions}
        onSortChange={action('onSortChange')}
      >
        {(tableData) => renderTransactionTable(tableData, columnDefs)}
      </Table>
    </Box>
  );
};

export default TableMeta;
