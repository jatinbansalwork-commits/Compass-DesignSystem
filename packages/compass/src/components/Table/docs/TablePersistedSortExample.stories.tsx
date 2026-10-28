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
} from '../../Table';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import type { TableExampleItem } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import { Button } from '~components/Button';

const STORAGE_KEY = 'compass-table-example-sort-prefs';

type SortPrefs = {
  sortKey: string;
  isSortReversed: boolean;
};

const readSortPrefs = (): SortPrefs | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SortPrefs) : null;
  } catch {
    return null;
  }
};

const writeSortPrefs = (prefs: SortPrefs): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  const params = new URLSearchParams(window.location.search);
  params.set('sortKey', prefs.sortKey);
  params.set('sortDir', prefs.isSortReversed ? 'desc' : 'asc');
  window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
};

const applySortPrefs = (
  nodes: TableExampleItem[],
  prefs: SortPrefs | null,
): TableExampleItem[] => {
  if (!prefs?.sortKey) return nodes;
  const sorted = [...nodes];
  const compare = (a: TableExampleItem, b: TableExampleItem): number => {
    switch (prefs.sortKey) {
      case 'AMOUNT':
        return a.amount - b.amount;
      case 'DATE':
        return a.date.getTime() - b.date.getTime();
      case 'STATUS':
        return a.status.localeCompare(b.status);
      case 'PAYMENT_ID':
      default:
        return a.paymentId.localeCompare(b.paymentId);
    }
  };
  sorted.sort(compare);
  if (prefs.isSortReversed) sorted.reverse();
  return sorted;
};

const sortFunctions = {
  PAYMENT_ID: (array: TableExampleItem[]) =>
    [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
  AMOUNT: (array: TableExampleItem[]) => [...array].sort((a, b) => a.amount - b.amount),
  DATE: (array: TableExampleItem[]) => [...array].sort((a, b) => a.date.getTime() - b.date.getTime()),
  STATUS: (array: TableExampleItem[]) => [...array].sort((a, b) => a.status.localeCompare(b.status)),
};

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Persisted Sort',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const PersistedSortRoundTrip = (): React.ReactElement => {
  const baseData = React.useMemo(() => createTableData(12), []);
  const [remountKey, setRemountKey] = React.useState(0);
  const [savedPrefs, setSavedPrefs] = React.useState<SortPrefs | null>(() => readSortPrefs());
  const [displayData, setDisplayData] = React.useState(() =>
    applySortPrefs(baseData.nodes, readSortPrefs()),
  );

  const handleSortChange = ({
    sortKey,
    isSortReversed,
  }: {
    sortKey?: string;
    isSortReversed: boolean;
  }): void => {
    if (!sortKey) return;
    const prefs: SortPrefs = { sortKey, isSortReversed };
    writeSortPrefs(prefs);
    setSavedPrefs(prefs);
    setDisplayData(applySortPrefs(baseData.nodes, prefs));
  };

  const simulateReload = (): void => {
    const restored = readSortPrefs();
    setSavedPrefs(restored);
    setDisplayData(applySortPrefs(baseData.nodes, restored));
    setRemountKey((key) => key + 1);
  };

  const clearSaved = (): void => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSavedPrefs(null);
    setDisplayData(baseData.nodes);
    setRemountKey((key) => key + 1);
  };

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4" display="flex" flexDirection="column" gap="spacing.2">
        <Heading>Persisted sort round-trip</Heading>
        <Text>
          `onSortChange` writes sort key and direction to `localStorage` and syncs query params
          (`sortKey`, `sortDir`). Use &quot;Simulate reload&quot; to remount the table the way a
          page refresh would — consumer code reapplies the saved sort to data before render.
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          Saved:{' '}
          {savedPrefs
            ? `${savedPrefs.sortKey} ${savedPrefs.isSortReversed ? 'desc' : 'asc'}`
            : 'none (default data order)'}
        </Text>
        <Box display="flex" gap="spacing.2">
          <Button variant="secondary" onClick={simulateReload}>
            Simulate reload
          </Button>
          <Button variant="tertiary" onClick={clearSaved}>
            Clear saved sort
          </Button>
        </Box>
      </Box>
      <Table
        key={remountKey}
        data={{ nodes: displayData }}
        sortFunctions={sortFunctions}
        onSortChange={handleSortChange}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
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
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
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
