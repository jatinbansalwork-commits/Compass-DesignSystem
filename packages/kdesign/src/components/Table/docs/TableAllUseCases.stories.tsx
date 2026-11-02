import { applyTableFlagshipRecipeMeta } from './tableStorybookMeta';
import React, { useEffect, useMemo } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import {
  KdesignDataTable,
  TableExperienceEmptyBody,
  TableExperienceRow,
  TableExperienceResizableHeaderCell,
  useTableExperienceController,
  TableEditableCell,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
} from '../index';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import {
  readTableExperienceLayoutPrefs,
  writeTableExperienceLayoutPrefs,
} from './tableExperienceLayoutStorage';
import { Box } from '~components/Box';
import { Heading, Text, Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Alert } from '~components/Alert';
import { Tooltip } from '~components/Tooltip';
import { CopyIcon, TrashIcon } from '~components/Icons';
import { TableHeaderTitleWithInfo } from './TableHeaderTitleWithInfo';
import { tableIcons } from '../tokens';

const LAYOUT_STORAGE_KEY = 'kdesign-table-all-use-cases-layout-v3';

const clampSavedExperienceColumnWidth = (
  key: string,
  widthPx: number,
): number => {
  const meta = FILTER_COLUMNS.find((column) => column.key === key);
  if (!meta) {
    return widthPx;
  }
  const maxPx = Math.max(meta.defaultWidthPx + 120, meta.minWidthPx + 160);
  return Math.min(Math.max(widthPx, meta.minWidthPx), maxPx);
};
const sourceData = createTableData(48);

const DISABLED_ROW_IDS = new Set(['3', '7']);
/** Cross-doc / compliance exceptions (demo). */
const COMPLIANCE_FLAG_ROW_IDS = new Set(['5', '12', '18']);
/** Duty cell shows validation error (demo). */
const DUTY_VALIDATION_ERROR_ROW_IDS = new Set(['8']);

const FILTER_COLUMNS = [
  { key: 'SHIPMENT_ID', label: 'Shipment ID', defaultWidthPx: 160, minWidthPx: 120 },
  { key: 'NAME', label: 'Importer', defaultWidthPx: 200, minWidthPx: 140 },
  /** minWidth fits footer summary copy e.g. "15 released" with cell padding. */
  { key: 'STATUS', label: 'Status', defaultWidthPx: 152, minWidthPx: 128 },
] as const;

/**
 * How many **data** columns stay frozen on horizontal scroll (first N in column order).
 * The multi-select checkbox is always sticky separately — e.g. `1` → checkbox + Shipment ID only;
 * `3` → checkbox + Shipment ID + Importer + Status (when those are the first three columns).
 */
const STICKY_LEADING_DATA_COLUMN_COUNT = 1;

type Row = (typeof sourceData.nodes)[number];

const matchesStringOrArray = (itemValue: string, filterValue: string | string[]): boolean =>
  Array.isArray(filterValue)
    ? filterValue.length === 0 || filterValue.includes(itemValue)
    : !filterValue || itemValue.toLowerCase().includes(filterValue.toLowerCase());

const STATUS_FILTER_OPTIONS = [
  { label: 'Released', value: 'Released' },
  { label: 'Exam hold', value: 'Exam hold' },
  { label: 'Rejected', value: 'Rejected' },
  { label: 'Pending CBP review', value: 'Pending CBP review' },
] as const;

const ISF_FILTER_OPTIONS = [
  { label: 'Matched', value: 'Matched' },
  { label: 'Not filed', value: 'Not filed' },
  { label: 'Amended', value: 'Amended' },
  { label: 'On hold', value: 'On hold' },
] as const;

const filterFunctions = {
  SHIPMENT_ID: (item: Row, value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.paymentId.toLowerCase().includes(needle.toLowerCase());
  },
  NAME: (item: Row, value: string | string[]) => {
    const needle = Array.isArray(value) ? value.join(' ') : value;
    return item.name.toLowerCase().includes(needle.toLowerCase());
  },
  STATUS: (item: Row, value: string | string[]) => matchesStringOrArray(item.status, value),
  ISF: (item: Row, value: string | string[]) => matchesStringOrArray(item.isfStatus, value),
};

const columnFilterConfig = {
  STATUS: { type: 'multiselect' as const, options: [...STATUS_FILTER_OPTIONS] },
  ISF: { type: 'dropdown' as const, options: [...ISF_FILTER_OPTIONS] },
};

const sortFunctions = {
  SHIPMENT_ID: (array: Row[]) => [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
  NAME: (array: Row[]) => [...array].sort((a, b) => a.name.localeCompare(b.name)),
  STATUS: (array: Row[]) => [...array].sort((a, b) => a.status.localeCompare(b.status)),
  DATE: (array: Row[]) => [...array].sort((a, b) => a.date.getTime() - b.date.getTime()),
  AMOUNT: (array: Row[]) => [...array].sort((a, b) => a.amount - b.amount),
  ENTRY_TYPE: (array: Row[]) => [...array].sort((a, b) => a.type.localeCompare(b.type)),
  BROKER: (array: Row[]) => [...array].sort((a, b) => a.broker.localeCompare(b.broker)),
  ENTRY_NUMBER: (array: Row[]) => [...array].sort((a, b) => a.entryNumber.localeCompare(b.entryNumber)),
  PORT: (array: Row[]) => [...array].sort((a, b) => a.portOfEntry.localeCompare(b.portOfEntry)),
  ORIGIN: (array: Row[]) =>
    [...array].sort((a, b) => a.countryOfOrigin.localeCompare(b.countryOfOrigin)),
  INVOICE: (array: Row[]) => [...array].sort((a, b) => a.invoiceValue - b.invoiceValue),
  CBP: (array: Row[]) =>
    [...array].sort((a, b) => a.cbpTransactionId.localeCompare(b.cbpTransactionId)),
  ISF: (array: Row[]) => [...array].sort((a, b) => a.isfStatus.localeCompare(b.isfStatus)),
  UPDATED: (array: Row[]) => [...array].sort((a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime()),
};

type TrailingColumnDef = {
  headerKey?: string;
  label: string;
  /** CSS grid track — size for header label (+ info icon + sort) and typical cell content. */
  gridTrack: string;
  infoTooltip?: string;
  textAlign?: 'left' | 'right';
};

/** Fixed columns after the three experience-managed filter columns (20 headers total). */
const TRAILING_COLUMN_DEFS: TrailingColumnDef[] = [
  { headerKey: 'HTS', label: 'HTS code', gridTrack: 'minmax(108px, 128px)' },
  /** min fits sortable "Entry type" label + sort control + padding (see TableHeaderCell). */
  { headerKey: 'ENTRY_TYPE', label: 'Entry type', gridTrack: 'minmax(132px, 152px)' },
  { headerKey: 'MOT', label: 'MOT', gridTrack: 'minmax(72px, 88px)' },
  { headerKey: 'DATE', label: 'Entry date', gridTrack: 'minmax(100px, 120px)' },
  { headerKey: 'BROKER', label: 'Broker', gridTrack: 'minmax(128px, 160px)' },
  { label: 'Compliance', gridTrack: 'minmax(96px, 112px)' },
  {
    headerKey: 'ENTRY_NUMBER',
    label: 'Entry number',
    gridTrack: 'minmax(152px, 176px)',
    infoTooltip:
      'Customs entry number (ENT-*). Distinct from the KlearNow shipment ID (KX-*) in the first column.',
  },
  {
    headerKey: 'PORT',
    label: 'Port of entry',
    gridTrack: 'minmax(148px, 168px)',
    infoTooltip: 'U.S. port where the consumption entry was filed (e.g. Los Angeles, Newark).',
  },
  { headerKey: 'ORIGIN', label: 'Country of origin', gridTrack: 'minmax(128px, 148px)' },
  { headerKey: 'INVOICE', label: 'Invoice value', gridTrack: 'minmax(112px, 132px)' },
  { headerKey: 'CBP', label: 'CBP transaction', gridTrack: 'minmax(108px, 128px)' },
  { label: 'Carrier ref', gridTrack: 'minmax(120px, 140px)' },
  /** min fits sortable header label "ISF status" + sort affordance + padding. */
  { headerKey: 'ISF', label: 'ISF status', gridTrack: 'minmax(120px, 140px)' },
  { headerKey: 'UPDATED', label: 'Last updated', gridTrack: 'minmax(108px, 128px)' },
  { label: 'Analyst', gridTrack: 'minmax(96px, 120px)' },
  { label: 'PGA hold', gridTrack: 'minmax(100px, 120px)' },
  /** Fixed track — pairs with `trailingStickyColumnCount` so footer duty total stays in the first viewport. */
  { headerKey: 'AMOUNT', label: 'Duty amount', gridTrack: '140px', textAlign: 'right' },
];

/** Must match Duty amount grid track / `trailingStickyColumnWidths`. */
const DUTY_AMOUNT_STICKY_WIDTH_PX = 140;

const TRAILING_COLUMN_COUNT = TRAILING_COLUMN_DEFS.length;

const TRAILING_GRID_TEMPLATE_COLUMNS = TRAILING_COLUMN_DEFS.map((column) => column.gridTrack);

const emptyStateGridColumnEnd =
  1 + FILTER_COLUMNS.length + TRAILING_COLUMN_COUNT + 1;

const storyMeta: Meta = {
  title: 'Components/Table',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        story:
          'Enterprise clearance-queue reference (~20 columns): Excel-style gridlines, horizontal scroll, inline header filters + advanced filters, saved column layout, export/copy selection, compliance + validation rows, sticky leading lane (page totals under Shipment ID) + trailing sticky Duty amount (footer rollup visible without scrolling), and batch-friendly toolbar.',
      },
    },
  },
};

const AllUseCasesTemplate: StoryFn = () => {
  const savedLayout = useMemo(() => {
    const raw = readTableExperienceLayoutPrefs(LAYOUT_STORAGE_KEY);
    if (!raw?.columnWidths) {
      return raw;
    }
    return {
      ...raw,
      columnWidths: Object.fromEntries(
        Object.entries(raw.columnWidths).map(([key, widthPx]) => [
          key,
          clampSavedExperienceColumnWidth(key, widthPx),
        ]),
      ),
    };
  }, []);

  const controller = useTableExperienceController({
    data: sourceData,
    filterFunctions,
    filterConfig: columnFilterConfig,
    sortFunctions,
    filterableColumns: [...FILTER_COLUMNS],
    filterFieldExtractors: {
      SHIPMENT_ID: (row) => row.paymentId,
      NAME: (row) => row.name,
      STATUS: (row) => row.status,
    },
    initialSort: { sortKey: 'SHIPMENT_ID', direction: 'asc' },
    initialColumnOrder: savedLayout?.columnOrder,
    initialVisibleColumnKeys: savedLayout?.visibleColumnKeys,
    initialColumnWidths: savedLayout?.columnWidths,
    selectionType: 'multiple',
    gridTrailingTemplateColumns: [...TRAILING_GRID_TEMPLATE_COLUMNS],
    stickyLeadingColumnCount: STICKY_LEADING_DATA_COLUMN_COUNT,
    features: {
      multiSort: true,
      advancedFilters: true,
      columnToggle: true,
      columnReorder: true,
      columnResize: true,
      rowKeyboardNavigation: true,
      metaKeySelection: true,
      hideInlineHeaderFiltersWhenAdvanced: false,
    },
  });

  const api = controller.experienceProps;
  const orderedKeys = api.experienceOrderedVisibleColumnKeys;
  const selectedCount = controller.selectedIds.length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      writeTableExperienceLayoutPrefs(LAYOUT_STORAGE_KEY, {
        columnOrder: api.experienceColumnOrder,
        visibleColumnKeys: api.experienceVisibleColumnKeys,
        columnWidths: api.experienceColumnWidths,
      });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [
    api.experienceColumnOrder,
    api.experienceVisibleColumnKeys,
    api.experienceColumnWidths,
  ]);

  const renderHeaderCell = (key: (typeof FILTER_COLUMNS)[number]['key'], label: string) => {
    const metaColumn = FILTER_COLUMNS.find((column) => column.key === key);
    const widthPx = api.experienceColumnWidths[key] ?? metaColumn?.defaultWidthPx ?? 140;
    return (
      <TableHeaderCell headerKey={key}>
        <TableExperienceResizableHeaderCell
          columnKey={key}
          widthPx={widthPx}
          minWidthPx={metaColumn?.minWidthPx}
          onWidthChange={api.setExperienceColumnWidth}
        >
          {key === 'SHIPMENT_ID' ? (
            <TableHeaderTitleWithInfo
              title={label}
              infoTooltip="KlearNow shipment identifier (KX-*). Used across clearance, billing, and ACE matching."
              infoAccessibilityLabel="About Shipment ID"
            />
          ) : (
            label
          )}
        </TableExperienceResizableHeaderCell>
      </TableHeaderCell>
    );
  };

  const renderTrailingHeaderCell = (column: TrailingColumnDef) => (
    <TableHeaderCell
      key={column.headerKey ?? column.label}
      headerKey={column.headerKey}
      textAlign={column.textAlign}
    >
      {column.infoTooltip ? (
        <TableHeaderTitleWithInfo
          title={column.label}
          infoTooltip={column.infoTooltip}
          infoAccessibilityLabel={`About ${column.label}`}
        />
      ) : (
        column.label
      )}
    </TableHeaderCell>
  );

  const renderFilterableBodyCell = (key: string, row: Row) => {
    if (key === 'SHIPMENT_ID') {
      return (
        <TableCell>
          <Code size="medium">{row.paymentId}</Code>
        </TableCell>
      );
    }
    if (key === 'NAME') {
      return <TableCell>{row.name}</TableCell>;
    }
    if (key === 'STATUS') {
      return (
        <TableCell>
          <Badge size="medium" color={getStatusColor(row.status)}>
            {row.status}
          </Badge>
        </TableCell>
      );
    }
    return null;
  };

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      maxWidth="100%"
      minHeight="560px"
    >
      <Box paddingBottom="spacing.4" maxWidth="960px">
        <Heading marginBottom="spacing.2">All use cases</Heading>
        <Text color="surface.text.gray.muted">
          Wide clearance queue (20 columns) for scroll, sticky lane, and column tooling. Sticky
          count is set by STICKY_LEADING_DATA_COLUMN_COUNT in this story (checkbox is always sticky
          with multi-select). Inline + advanced filters, layout persisted to localStorage,
          export selection, compliance flags, duty validation, row keyboard nav (focus table → ↑↓,
          Space).
          Header checkbox selects <Text as="span" weight="semibold">this page only</Text> — selections
          persist across pages until cleared.
        </Text>
      </Box>
      {selectedCount > 0 ? (
        <Box paddingBottom="spacing.3">
          <Alert
            emphasis="subtle"
            color="primary"
            isFullWidth
            isDismissible={false}
            title={`${selectedCount} row${selectedCount === 1 ? '' : 's'} selected`}
            description="Export uses the full selection (including other pages). The header checkbox only toggles rows on the current page."
          />
        </Box>
      ) : null}
      <KdesignDataTable
        {...controller.experienceProps}
        experienceApi={controller.experienceProps}
        multiSelectTrigger="checkbox"
        exportPreferSelection
        showHeaderFilterRow
        isHeaderSticky
        isFooterSticky
        trailingStickyColumnCount={1}
        trailingStickyColumnWidths={[`${DUTY_AMOUNT_STICKY_WIDTH_PX}px`]}
        showBorderedCells
        height="520px"
        toolbarTitle="Clearance queue"
        toolbarSelectedTitle={`${selectedCount} selected`}
        exportFileName="clearance-queue"
        exportColumns={[
          { header: 'Shipment ID', getValue: (row) => row.paymentId },
          { header: 'Importer', getValue: (row) => row.name },
          { header: 'Status', getValue: (row) => row.status },
          { header: 'HTS', getValue: (row) => row.account },
          { header: 'Entry type', getValue: (row) => row.type },
          { header: 'MOT', getValue: (row) => row.method },
          { header: 'Entry date', getValue: (row) => formatDate(row.date) ?? '' },
          { header: 'Broker', getValue: (row) => row.broker },
          { header: 'Entry number', getValue: (row) => row.entryNumber },
          { header: 'Port of entry', getValue: (row) => row.portOfEntry },
          { header: 'Country of origin', getValue: (row) => row.countryOfOrigin },
          { header: 'Invoice value', getValue: (row) => String(row.invoiceValue) },
          { header: 'CBP transaction', getValue: (row) => row.cbpTransactionId },
          { header: 'Carrier ref', getValue: (row) => row.carrierReference },
          { header: 'ISF status', getValue: (row) => row.isfStatus },
          { header: 'Last updated', getValue: (row) => formatDate(row.lastUpdated) ?? '' },
          { header: 'Assigned analyst', getValue: (row) => row.assignedAnalyst },
          { header: 'PGA hold', getValue: (row) => row.pgaHold },
          { header: 'Duty amount', getValue: (row) => String(row.amount) },
        ]}
        pagination={
          <TablePagination
            defaultPageSize={15}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={() => undefined}
          />
        }
      >
        {(tableData) => {
          const pageTotal = tableData.reduce((sum, row) => sum + row.amount, 0);
          const releasedOnPage = tableData.filter((row) => row.status === 'Released').length;

          return (
            <>
              <TableHeader>
                <TableHeaderRow>
                  {orderedKeys.map((key) => {
                    const column = FILTER_COLUMNS.find((item) => item.key === key);
                    return column ? renderHeaderCell(column.key, column.label) : null;
                  })}
                  {TRAILING_COLUMN_DEFS.map((column) => renderTrailingHeaderCell(column))}
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                <TableExperienceEmptyBody
                  visibleRowCount={tableData.length}
                  totalRowCount={sourceData.nodes.length}
                  gridColumnEnd={emptyStateGridColumnEnd}
                />
                {tableData.map((row) => (
                  <TableExperienceRow
                    key={row.id}
                    item={row}
                    isDisabled={DISABLED_ROW_IDS.has(String(row.id))}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size={tableIcons.rowHoverTextButton}>
                          View entry
                        </Button>
                        <IconButton
                          size={tableIcons.rowHover}
                          icon={CopyIcon}
                          isHighlighted
                          accessibilityLabel="Copy shipment ID"
                          onClick={() => undefined}
                        />
                        <IconButton
                          size={tableIcons.rowHover}
                          icon={TrashIcon}
                          isHighlighted
                          accessibilityLabel="Remove from queue"
                          onClick={() => undefined}
                        />
                      </>
                    }
                  >
                    {orderedKeys.map((key) => (
                      <React.Fragment key={key}>{renderFilterableBodyCell(key, row)}</React.Fragment>
                    ))}
                    <TableCell>{row.account}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.method}</TableCell>
                    <TableCell>{formatDate(row.date)}</TableCell>
                    <TableCell>{row.broker}</TableCell>
                    <TableCell>
                      {COMPLIANCE_FLAG_ROW_IDS.has(String(row.id)) ? (
                        <Tooltip content="HTS or value mismatch flagged against sibling documents">
                          <Badge size="medium" color="notice">
                            Review
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Text color="surface.text.gray.muted">—</Text>
                      )}
                    </TableCell>
                    <TableCell>
                      <Code size="medium">{row.entryNumber}</Code>
                    </TableCell>
                    <TableCell>{row.portOfEntry}</TableCell>
                    <TableCell>{row.countryOfOrigin}</TableCell>
                    <TableCell>
                      <Amount value={row.invoiceValue} />
                    </TableCell>
                    <TableCell>{row.cbpTransactionId}</TableCell>
                    <TableCell>{row.carrierReference}</TableCell>
                    <TableCell>
                      <Badge
                        size="medium"
                        color={row.isfStatus === 'Matched' ? 'positive' : 'notice'}
                      >
                        {row.isfStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(row.lastUpdated)}</TableCell>
                    <TableCell>{row.assignedAnalyst}</TableCell>
                    <TableCell>
                      {row.pgaHold === 'None' ? (
                        <Text color="surface.text.gray.muted">—</Text>
                      ) : (
                        row.pgaHold
                      )}
                    </TableCell>
                    <TableCell textAlign="right">
                      <TableEditableCell
                        accessibilityLabel="Duty amount"
                        placeholder="Enter amount"
                        defaultValue={String(row.amount)}
                        validationState={
                          DUTY_VALIDATION_ERROR_ROW_IDS.has(String(row.id)) ? 'error' : undefined
                        }
                        errorText={
                          DUTY_VALIDATION_ERROR_ROW_IDS.has(String(row.id))
                            ? 'Does not match declared invoice total'
                            : undefined
                        }
                        successText="Saved"
                      />
                    </TableCell>
                  </TableExperienceRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableFooterRow>
                  <TableFooterCell>—</TableFooterCell>
                  {orderedKeys.map((key, index) => (
                    <TableFooterCell key={key}>
                      {index === 0
                        ? `Page totals (${tableData.length} rows)`
                        : key === 'STATUS'
                          ? `${releasedOnPage} released`
                          : '—'}
                    </TableFooterCell>
                  ))}
                  {TRAILING_COLUMN_DEFS.map((column) => (
                    <TableFooterCell
                      key={column.headerKey ?? column.label}
                      textAlign={column.textAlign}
                    >
                      {column.headerKey === 'AMOUNT' ? (
                        <Amount value={pageTotal} />
                      ) : (
                        '—'
                      )}
                    </TableFooterCell>
                  ))}
                  <TableFooterCell>{null}</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          );
        }}
      </KdesignDataTable>
    </Box>
  );
};

export const AllUseCases = AllUseCasesTemplate.bind({});
AllUseCases.storyName = 'All use cases';

AllUseCases.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { name: 'All use cases' })).toBeVisible();
  await expect(canvas.getByText('Clearance queue')).toBeVisible();
  const tableRegion = canvas.getByRole('table');
  await expect(tableRegion).toBeVisible();
  await userEvent.click(canvas.getAllByRole('checkbox')[1]);
  await waitFor(() =>
    expect(canvas.getByRole('button', { name: /Export \(1\)/i })).toBeVisible(),
  );
};

applyTableFlagshipRecipeMeta(storyMeta);
export default storyMeta;
