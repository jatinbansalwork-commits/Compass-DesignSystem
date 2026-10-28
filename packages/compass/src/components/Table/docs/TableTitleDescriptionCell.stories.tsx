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
  TableTitleDescriptionCell,
} from '../index';
import { createTableData } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';

const data = createTableData(5);

const meta: Meta = {
  title: 'Components/Table/Features/Title Description Cell',
  tags: ['autodocs'],
};

export const TruncatedDescription = (): React.ReactElement => (
  <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="320px">
    <Heading marginBottom="spacing.3">Truncated description</Heading>
    <Table data={data}>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Merchant</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} item={row}>
                <TableCell>
                  <TableTitleDescriptionCell
                    title={row.name}
                    description="Long supporting copy that truncates after two lines and shows a native title tooltip when hovered if text is clipped."
                    descriptionBehavior="truncate"
                    descriptionLines={2}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  </Box>
);

export const WrappedDescription = (): React.ReactElement => (
  <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="320px">
    <Heading marginBottom="spacing.3">Wrapped description</Heading>
    <Text marginBottom="spacing.3" color="surface.text.gray.muted">
      Row height grows; no truncation tooltip.
    </Text>
    <Table data={data}>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Merchant</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.id} item={row}>
                <TableCell>
                  <TableTitleDescriptionCell
                    title={row.name}
                    description="Supporting copy wraps across multiple lines so reviewers can read the full sentence without a tooltip."
                    descriptionBehavior="wrap"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  </Box>
);

export default meta;
