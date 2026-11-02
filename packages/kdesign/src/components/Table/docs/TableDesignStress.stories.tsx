import { applyTableFlagshipRecipeMeta } from './tableStorybookMeta';
import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import {
  KdesignDataTable,
  TableExperienceRow,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TablePagination,
} from '../index';
import { useTableExperienceController } from '../experience/useTableExperienceController';
import { createTableData } from './exampleData';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { getStatusColor } from './exampleData';

/** Large dataset + full experience chrome for manual / automated design stress. */
const stressData = createTableData(120);

/** Data columns frozen on horizontal scroll (checkbox is sticky separately). */
const STICKY_LEADING_DATA_COLUMN_COUNT = 3;

const FILTER_COLUMNS = [
  { key: 'SHIPMENT_ID', label: 'Shipment ID', defaultWidthPx: 160, minWidthPx: 120 },
  { key: 'NAME', label: 'Importer', defaultWidthPx: 200, minWidthPx: 140 },
  { key: 'STATUS', label: 'Status', defaultWidthPx: 150, minWidthPx: 110 },
] as const;

const TRAILING_TRACKS = [
  'minmax(108px, 128px)',
  'minmax(132px, 152px)',
  'minmax(72px, 88px)',
  'minmax(100px, 120px)',
  'minmax(128px, 160px)',
  'minmax(96px, 112px)',
  'minmax(152px, 176px)',
  'minmax(148px, 168px)',
  'minmax(128px, 148px)',
  'minmax(112px, 132px)',
  'minmax(108px, 128px)',
  'minmax(120px, 140px)',
  'minmax(120px, 140px)',
  'minmax(108px, 128px)',
  'minmax(96px, 120px)',
  'minmax(100px, 120px)',
  'minmax(120px, 140px)',
];

const storyMeta: Meta = {
  title: 'Components/Table/Examples/Design stress test',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          'Stress harness: 120 rows, 20 columns, sticky filter lane, header filters, toolbar search, pagination, export. Use Interactions panel or `.play` for smoke; manually verify horizontal scroll, sticky alignment, and toolbar layout.',
      },
    },
  },
};

const getTableHorizontalScrollHost = (root: HTMLElement): HTMLElement | null => {
  const table = root.querySelector('[data-table-library_table]');
  let node: HTMLElement | null = table?.parentElement ?? null;
  while (node && node !== root) {
    const { overflowX } = window.getComputedStyle(node);
    if (overflowX === 'auto' || overflowX === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }
  return table?.parentElement instanceof HTMLElement ? table.parentElement : null;
};

const DesignStressTemplate: StoryFn = () => {
  const controller = useTableExperienceController({
    data: stressData,
    filterFunctions: {
      SHIPMENT_ID: (item, value) => {
        const needle = Array.isArray(value) ? value.join(' ') : value;
        return item.paymentId.toLowerCase().includes(needle.toLowerCase());
      },
      NAME: (item, value) => {
        const needle = Array.isArray(value) ? value.join(' ') : value;
        return item.name.toLowerCase().includes(needle.toLowerCase());
      },
      STATUS: (item, value) => {
        const v = Array.isArray(value) ? value : [value];
        return v.length === 0 || v.includes(item.status);
      },
    },
    sortFunctions: {
      SHIPMENT_ID: (array) => [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
    },
    filterableColumns: [...FILTER_COLUMNS],
    filterFieldExtractors: {
      SHIPMENT_ID: (row) => row.paymentId,
      NAME: (row) => row.name,
      STATUS: (row) => row.status,
    },
    selectionType: 'multiple',
    gridTrailingTemplateColumns: TRAILING_TRACKS,
    stickyLeadingColumnCount: STICKY_LEADING_DATA_COLUMN_COUNT,
    features: {
      advancedFilters: true,
      columnToggle: true,
      columnReorder: true,
      columnResize: true,
      multiSort: false,
      rowKeyboardNavigation: false,
      hideInlineHeaderFiltersWhenAdvanced: false,
    },
  });

  const api = controller.experienceProps;
  const orderedKeys = api.experienceOrderedVisibleColumnKeys;

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" maxWidth="100%">
      <Box paddingBottom="spacing.4">
        <Heading marginBottom="spacing.2">Table design stress test</Heading>
        <Text color="surface.text.gray.muted">
          120 rows × 20 columns — exercise scrollport width, sticky lane, filters, selection, and
          pagination under load.
        </Text>
      </Box>
      <KdesignDataTable
        {...controller.experienceProps}
        experienceApi={controller.experienceProps}
        multiSelectTrigger="checkbox"
        showHeaderFilterRow
        isHeaderSticky
        isFooterSticky
        showBorderedCells
        height="480px"
        toolbarTitle="Stress queue"
        exportFileName="stress-export"
        exportColumns={[
          { header: 'Shipment ID', getValue: (row) => row.paymentId },
          { header: 'Importer', getValue: (row) => row.name },
        ]}
        pagination={
          <TablePagination defaultPageSize={25} showPageSizePicker showPageNumberSelector />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {orderedKeys.map((key) => {
                  const column = FILTER_COLUMNS.find((item) => item.key === key);
                  return column ? (
                    <TableHeaderCell key={key} headerKey={key}>
                      {column.label}
                    </TableHeaderCell>
                  ) : null;
                })}
                <TableHeaderCell headerKey="HTS">HTS code</TableHeaderCell>
                <TableHeaderCell headerKey="ENTRY_TYPE">Entry type</TableHeaderCell>
                <TableHeaderCell headerKey="MOT">MOT</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Entry date</TableHeaderCell>
                <TableHeaderCell headerKey="BROKER">Broker</TableHeaderCell>
                <TableHeaderCell>Compliance</TableHeaderCell>
                <TableHeaderCell headerKey="ENTRY_NUMBER">Entry number</TableHeaderCell>
                <TableHeaderCell headerKey="PORT">Port of entry</TableHeaderCell>
                <TableHeaderCell headerKey="ORIGIN">Country of origin</TableHeaderCell>
                <TableHeaderCell headerKey="INVOICE">Invoice value</TableHeaderCell>
                <TableHeaderCell headerKey="CBP">CBP transaction</TableHeaderCell>
                <TableHeaderCell>Carrier ref</TableHeaderCell>
                <TableHeaderCell headerKey="ISF">ISF status</TableHeaderCell>
                <TableHeaderCell headerKey="UPDATED">Last updated</TableHeaderCell>
                <TableHeaderCell>Analyst</TableHeaderCell>
                <TableHeaderCell>PGA hold</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Duty amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableExperienceRow key={row.id} item={row}>
                  {orderedKeys.map((key) => {
                    if (key === 'SHIPMENT_ID') {
                      return (
                        <TableCell key={key}>
                          <Code size="medium">{row.paymentId}</Code>
                        </TableCell>
                      );
                    }
                    if (key === 'NAME') {
                      return <TableCell key={key}>{row.name}</TableCell>;
                    }
                    if (key === 'STATUS') {
                      return (
                        <TableCell key={key}>
                          <Badge size="medium" color={getStatusColor(row.status)}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      );
                    }
                    return null;
                  })}
                  <TableCell>{row.account}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.method}</TableCell>
                  <TableCell>{row.date.toLocaleDateString()}</TableCell>
                  <TableCell>{row.broker}</TableCell>
                  <TableCell>—</TableCell>
                  <TableCell>{row.entryNumber}</TableCell>
                  <TableCell>{row.portOfEntry}</TableCell>
                  <TableCell>{row.countryOfOrigin}</TableCell>
                  <TableCell>{row.invoiceValue}</TableCell>
                  <TableCell>{row.cbpTransactionId}</TableCell>
                  <TableCell>{row.carrierReference}</TableCell>
                  <TableCell>{row.isfStatus}</TableCell>
                  <TableCell>{row.lastUpdated.toLocaleDateString()}</TableCell>
                  <TableCell>{row.assignedAnalyst}</TableCell>
                  <TableCell>{row.pgaHold}</TableCell>
                  <TableCell textAlign="right">{row.amount}</TableCell>
                </TableExperienceRow>
              ))}
            </TableBody>
          </>
        )}
      </KdesignDataTable>
    </Box>
  );
};

export const DesignStress = DesignStressTemplate.bind({});
DesignStress.storyName = 'Design stress test';

DesignStress.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { name: 'Table design stress test' })).toBeVisible();
  await expect(canvas.getByRole('table')).toBeVisible();
  await expect(canvas.getByLabelText('Search all columns')).toBeVisible();
  await expect(canvas.getByRole('button', { name: /^Filters$/i })).toBeVisible();

  const searchBox = canvas.getByLabelText('Search all columns');
  await userEvent.type(searchBox, 'KX-100');
  await userEvent.click(canvas.getAllByRole('checkbox')[1]);
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: /Export \(1\)/i })).toBeVisible(),
  );

  const filtersButton = canvas.getByRole('button', { name: /^Filters$/i });

  await userEvent.click(filtersButton);
  await expect(canvas.getByRole('button', { name: /^Apply$/i })).toBeVisible();

  const scrollHost = getTableHorizontalScrollHost(canvasElement);
  if (scrollHost) {
    scrollHost.scrollLeft = scrollHost.scrollWidth;
    await expect(canvas.getByRole('columnheader', { name: /Duty amount/i })).toBeInTheDocument();
  }

  const pageTwo = canvas.queryByRole('button', { name: '2' });
  if (pageTwo) {
    await userEvent.click(pageTwo);
  }
};

applyTableFlagshipRecipeMeta(storyMeta);
export default storyMeta;
