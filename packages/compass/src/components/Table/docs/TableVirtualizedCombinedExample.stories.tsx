import React, { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableVirtualizedWrapper,
  TableToolbar,
  TableToolbarSearch,
} from '../index';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import { createTableData, getStatusColor } from './exampleData';

const source = createTableData(500);

const filterFunctions = {
  NAME: (item: (typeof source.nodes)[number], value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.name.toLowerCase().includes(needle.toLowerCase());
  },
};

const meta: Meta = {
  title: 'Components/Table/Features/Virtualized Combined',
  tags: ['autodocs'],
  parameters: { chromatic: { disableSnapshot: true } },
};

/**
 * Virtualized + sticky header + filter row + toolbar search.
 * Do **not** combine with `isGrouped` — dev builds throw when both are enabled.
 */
export const FilterStickyVirtualized = (): React.ReactElement => {
  const [globalFilter, setGlobalFilter] = useState('');

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="640px">
      <Box paddingBottom="spacing.4">
        <Heading>Virtualized combined features</Heading>
        <Text color="surface.text.gray.muted">
          Fixed <Code size="medium">height</Code>, sticky header, header filters, global search, and
          windowed rows. Not compatible with <Code size="medium">isGrouped</Code>.
        </Text>
      </Box>
      <Table
        data={source}
        height="480px"
        isHeaderSticky
        isFirstColumnSticky
        filterFunctions={filterFunctions}
        globalFilterValue={globalFilter}
        onGlobalFilterValueChange={setGlobalFilter}
        gridTemplateColumns="minmax(140px, 160px) minmax(120px, 1fr) minmax(100px, 1fr) minmax(120px, 1fr)"
        toolbar={
          <TableToolbar title="Payments">
            <TableToolbarSearch />
          </TableToolbar>
        }
      >
        {() => (
          <TableVirtualizedWrapper>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="NAME">Name</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {(row) => (
                <TableRow key={row.id} item={row}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(row.status)}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={row.amount} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableVirtualizedWrapper>
        )}
      </Table>
    </Box>
  );
};

export default meta;
