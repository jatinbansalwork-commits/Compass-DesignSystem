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
  TableToolbar,
  TableToolbarActions,
  TablePagination,
} from '../../Table';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/TextInput';

const allRows = createTableData(80);

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Combined Features',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

/**
 * Non-virtualized table combining toolbar search (client-side filter), sticky first column,
 * sticky header, and client pagination — the pattern teams use when column filter rows are
 * not required.
 */
export const StickyFilterAndPagination = (): React.ReactElement => {
  const [query, setQuery] = React.useState('');

  const filteredData = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return allRows;
    return {
      nodes: allRows.nodes.filter(
        (row) =>
          row.paymentId.toLowerCase().includes(normalized) ||
          row.name.toLowerCase().includes(normalized) ||
          row.status.toLowerCase().includes(normalized),
      ),
    };
  }, [query]);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="480px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Sticky column + header, search filter, pagination</Heading>
        <Text>
          Wide dataset with horizontal scroll, first column frozen, toolbar search filtering rows
          before pagination. Compass `Table` does not expose column filter-row props here — this
          mirrors how apps combine toolbar search with table layout props.
        </Text>
      </Box>
      <Table
        data={filteredData}
        isHeaderSticky
        isFirstColumnSticky
        height="420px"
        gridTemplateColumns="minmax(140px, 160px) minmax(120px, 1fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(160px, 1fr) minmax(100px, 1fr) minmax(100px, 1fr)"
        toolbar={
          <TableToolbar title="Payments">
            <TableToolbarActions>
              <TextInput
                label="Filter payments"
                placeholder="Search ID, name, or status"
                value={query}
                onChange={({ value }) => setQuery(value ?? '')}
              />
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            defaultPageSize={10}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={() => undefined}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem) => (
                <TableRow key={tableItem.id} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>{tableItem.account}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
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

export default TableMeta;
