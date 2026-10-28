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
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';

type ShipmentNode = {
  id: string;
  label: string;
  quantity?: number;
  value?: number;
  nodes: ShipmentNode[] | null;
};

const deepShipmentData: { nodes: ShipmentNode[] } = {
  nodes: [
    {
      id: 'shp-1001',
      label: 'Shipment SHP-1001 — Shenzhen → Los Angeles',
      nodes: [
        {
          id: 'ctr-a',
          label: 'Container MEDU1234567',
          nodes: [
            { id: 'line-a1', label: 'Line: HTS 8471.30 — Laptops', quantity: 120, value: 84000, nodes: null },
            { id: 'line-a2', label: 'Line: HTS 8517.12 — Phones', quantity: 400, value: 96000, nodes: null },
          ],
        },
        {
          id: 'ctr-b',
          label: 'Container MSCU7654321',
          nodes: [
            { id: 'line-b1', label: 'Line: HTS 9403.60 — Furniture', quantity: 45, value: 22500, nodes: null },
          ],
        },
      ],
    },
    {
      id: 'shp-1002',
      label: 'Shipment SHP-1002 — Busan → Long Beach',
      nodes: [
        {
          id: 'ctr-c',
          label: 'Container HLCU9988776',
          nodes: [
            { id: 'line-c1', label: 'Line: HTS 6204.62 — Apparel', quantity: 2000, value: 48000, nodes: null },
            { id: 'line-c2', label: 'Line: HTS 6403.99 — Footwear', quantity: 800, value: 32000, nodes: null },
            { id: 'line-c3', label: 'Line: HTS 3926.90 — Packaging', quantity: 500, value: 7500, nodes: null },
          ],
        },
      ],
    },
  ],
};

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Deep Nested Grouping',
  tags: ['autodocs'],
  component: Table,
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
  },
};

export const ThreeLevelShipmentHierarchy = (): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="480px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Three-level grouped rows (shipment → container → line item)</Heading>
        <Text>
          Expand parent rows to reveal containers, then line items. Uses `isGrouped` with nested
          `nodes` — deeper than the two-level payment grouping demo.
        </Text>
      </Box>
      <Table data={deepShipmentData} isGrouped showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Qty</TableHeaderCell>
                <TableHeaderCell>Value (USD)</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item) => {
                const level = (item as { treeXLevel?: number }).treeXLevel ?? 0;
                const isLeaf = level >= 2;
                return (
                  <TableRow key={item.id} item={item}>
                    <TableCell
                      gridColumnStart={level === 0 ? 1 : undefined}
                      gridColumnEnd={level === 0 ? 4 : undefined}
                    >
                      {item.label}
                    </TableCell>
                    {isLeaf ? (
                      <>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <Amount value={item.value ?? 0} />
                        </TableCell>
                      </>
                    ) : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export default TableMeta;
