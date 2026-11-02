import { applyTableFlagshipRecipeMeta } from './tableStorybookMeta';
import React, { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableEditableCell,
  TableEditableDropdownCell,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarActions,
} from '../index';
import { TableVirtualizedWrapper } from '../TableBody';
import type { Identifier } from '../types';
import type { InvoiceLineRow } from './lineItemsExampleData';
import {
  buildInvoiceLineTableData,
  computeCrossDocumentIssueLineIds,
  computeLineValidationIssues,
  COO_OPTIONS,
  HTS_OPTIONS,
  MANUFACTURERS,
  UOM_OPTIONS,
} from './lineItemsExampleData';
import {
  findFirstTextSearchMatchSerial,
  INVOICE_LINE_VIEW_PAGE_SIZE,
  renumberInvoiceLinesAfterDelete,
  resolveInvoiceLineJumpSerial,
  sliceInvoiceLinesViewWindow,
  type LineValidationIssues,
} from './invoiceLineItemsViewUtils';
import {
  handleInvoiceLineCellKeyDown,
  type InvoiceLineEditField,
} from './invoiceLineItemsCellKeyboard';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '~components/Modal';
import { TableHeaderTitleWithInfo } from './TableHeaderTitleWithInfo';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { Checkbox } from '~components/Checkbox';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Tooltip } from '~components/Tooltip';

const ISSUES_DEBOUNCE_MS = 240;
const STICKY_HEADER_PX = 44;
const STICKY_FIRST_COL_PX = 72;

type LineItemsStoryArgs = {
  lineCount: 30 | 200 | 500;
  enableVirtualization: boolean;
};

const HEADER_COLUMNS: {
  label: string;
  infoTooltip: string;
  headerKey?: string;
}[] = [
  {
    label: 'S.No',
    infoTooltip: 'Serial line number on this commercial invoice (highest at top).',
  },
  { label: 'SKU', infoTooltip: 'Stock keeping unit; aggregated lines open the merge drawer.' },
  { label: 'Description', infoTooltip: 'Commercial description of goods on the line.' },
  { label: 'HTS', infoTooltip: 'Harmonized Tariff Schedule code for classification.' },
  { label: 'Manufacturer', infoTooltip: 'Manufacturer from the invoice or extraction.' },
  { label: 'COO', infoTooltip: 'Country of origin ISO code.' },
  { label: 'UOM', infoTooltip: 'Unit of measure for quantity.' },
  { label: 'Qty', infoTooltip: 'Quantity in the stated UOM.' },
  { label: 'Unit price', infoTooltip: 'Unit price in invoice currency.' },
  { label: 'Duty', infoTooltip: 'Estimated duty for this line.' },
  { label: 'PO / Ref', infoTooltip: 'Purchase order or customer reference.' },
  { label: 'Cross-doc', infoTooltip: 'HTS duplicated across documents in this entry.' },
];

const storyMeta: Meta<LineItemsStoryArgs> = {
  title: 'Components/Table/Examples/Line Items',
  tags: ['autodocs'],
  parameters: {
    viewMode: 'story',
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          'Invoice line-items reference: checkbox selection (state in panel, not Table), inline edit + dropdown cells, debounced validation, exceptions-only vs jump search, and 30-row view windows (or full virtualized scale).',
      },
    },
  },
  args: {
    lineCount: 30,
    enableVirtualization: false,
  },
  argTypes: {
    lineCount: {
      control: 'select',
      options: [30, 200, 500],
    },
    enableVirtualization: {
      control: 'boolean',
    },
  },
};

const fieldError = (
  issues: LineValidationIssues | undefined,
  field: keyof LineValidationIssues,
  jumpForced: boolean,
):
  | { validationState: 'error'; errorText: string }
  | Record<string, never> => {
  const issue = issues?.[field];
  if (!issue && !jumpForced) {
    return {};
  }
  const message =
    issue?.message ??
    (jumpForced ? 'Highlighted from Exceptions drawer — review this field' : undefined);
  if (!message) {
    return {};
  }
  return { validationState: 'error' as const, errorText: message };
};

const InvoiceLineCellHost = ({
  lineId,
  field,
  children,
}: {
  lineId: string;
  field: InvoiceLineEditField;
  children: React.ReactElement;
}): React.ReactElement => (
  <Box display="contents" data-invoice-line-cell data-line-id={lineId} data-field={field}>
    {children}
  </Box>
);

type LineItemRowProps = {
  row: InvoiceLineRow;
  showCrossDocBadge: boolean;
  validationIssues: LineValidationIssues | undefined;
  jumpHighlight: boolean;
  onViewAggregateLines: (row: InvoiceLineRow) => void;
};

const LineItemRow = React.memo(function LineItemRow({
  row,
  showCrossDocBadge,
  validationIssues,
  jumpHighlight,
  onViewAggregateLines,
}: LineItemRowProps): React.ReactElement {
  const jumpForced = jumpHighlight;

  return (
    <Box display="contents" data-line-id={String(row.id)}>
      <TableRow item={row}>
      <TableCell>
        <Box
          backgroundColor={
            jumpHighlight
              ? showCrossDocBadge
                ? 'feedback.background.notice.subtle'
                : 'feedback.background.negative.subtle'
              : undefined
          }
          paddingX="spacing.1"
          borderRadius="small"
        >
          <Code size="medium">{row.lineNumber}</Code>
        </Box>
      </TableCell>
      <TableCell>
        {row.aggregatedSourceCount ? (
          <Button variant="tertiary" size="xsmall" onClick={() => onViewAggregateLines(row)}>
            <Box display="flex" flexDirection="row" gap="spacing.2" alignItems="center">
              <Badge size="medium" color="primary">
                {row.aggregatedSourceCount} lines
              </Badge>
              <Badge size="medium" color="notice">
                Aggregated
              </Badge>
            </Box>
          </Button>
        ) : (
          <InvoiceLineCellHost lineId={String(row.id)} field="sku">
            <TableEditableCell
              accessibilityLabel="SKU"
              placeholder="SKU"
              defaultValue={row.sku}
              {...fieldError(validationIssues, 'sku', jumpForced)}
              successText="Saved"
            />
          </InvoiceLineCellHost>
        )}
      </TableCell>
      <InvoiceLineCellHost lineId={String(row.id)} field="description">
        <TableEditableCell
          accessibilityLabel="Description"
          placeholder="Description"
          defaultValue={row.description}
          {...fieldError(validationIssues, 'description', jumpForced)}
          successText="Saved"
        />
      </InvoiceLineCellHost>
      <InvoiceLineCellHost lineId={String(row.id)} field="htsCode">
        <TableEditableDropdownCell>
          <AutoComplete
            accessibilityLabel="HTS code"
            defaultValue={row.htsCode}
            {...fieldError(validationIssues, 'htsCode', jumpForced)}
          />
          <DropdownOverlay>
            <ActionList>
              {HTS_OPTIONS.map((hts) => (
                <ActionListItem key={hts} title={hts} value={hts} />
              ))}
            </ActionList>
          </DropdownOverlay>
        </TableEditableDropdownCell>
      </InvoiceLineCellHost>
      <InvoiceLineCellHost lineId={String(row.id)} field="manufacturer">
        <TableEditableDropdownCell>
          <AutoComplete accessibilityLabel="Manufacturer" defaultValue={row.manufacturer} />
          <DropdownOverlay>
            <ActionList>
              {MANUFACTURERS.map((name) => (
                <ActionListItem key={name} title={name} value={name} />
              ))}
            </ActionList>
          </DropdownOverlay>
        </TableEditableDropdownCell>
      </InvoiceLineCellHost>
      <InvoiceLineCellHost lineId={String(row.id)} field="coo">
        <TableEditableDropdownCell>
          <AutoComplete accessibilityLabel="Country of origin" defaultValue={row.coo} />
          <DropdownOverlay>
            <ActionList>
              {COO_OPTIONS.map((coo) => (
                <ActionListItem key={coo} title={coo} value={coo} />
              ))}
            </ActionList>
          </DropdownOverlay>
        </TableEditableDropdownCell>
      </InvoiceLineCellHost>
      <InvoiceLineCellHost lineId={String(row.id)} field="uom">
        <TableEditableDropdownCell>
          <AutoComplete accessibilityLabel="Unit of measure" defaultValue={row.uom} />
          <DropdownOverlay>
            <ActionList>
              {UOM_OPTIONS.map((uom) => (
                <ActionListItem key={uom} title={uom} value={uom} />
              ))}
            </ActionList>
          </DropdownOverlay>
        </TableEditableDropdownCell>
      </InvoiceLineCellHost>
      <InvoiceLineCellHost lineId={String(row.id)} field="quantity">
        <TableEditableCell
          accessibilityLabel="Quantity"
          placeholder="0"
          defaultValue={String(row.quantity)}
          inputType="number"
          {...fieldError(validationIssues, 'quantity', jumpForced)}
          successText="Saved"
        />
      </InvoiceLineCellHost>
      <InvoiceLineCellHost lineId={String(row.id)} field="unitPrice">
        <TableEditableCell
          accessibilityLabel="Unit price"
          placeholder="0.00"
          defaultValue={String(row.unitPrice)}
          inputType="number"
          {...fieldError(validationIssues, 'unitPrice', jumpForced)}
          successText="Saved"
        />
      </InvoiceLineCellHost>
      <TableCell textAlign="right">
        <Amount value={row.dutyAmount} />
      </TableCell>
      <InvoiceLineCellHost lineId={String(row.id)} field="poReference">
        <TableEditableCell
          accessibilityLabel="PO reference"
          placeholder="PO"
          defaultValue={row.poReference}
          {...fieldError(validationIssues, 'poReference', jumpForced)}
          successText="Saved"
        />
      </InvoiceLineCellHost>
      <TableCell>
        {showCrossDocBadge ? (
          <Tooltip content="HTS also appears on another document in this entry">
            <Badge size="medium" color="notice">
              Exception
            </Badge>
          </Tooltip>
        ) : (
          <Text color="surface.text.gray.muted">—</Text>
        )}
      </TableCell>
      </TableRow>
    </Box>
  );
});

type InvoiceLineItemsPanelProps = {
  allLines: InvoiceLineRow[];
  onAllLinesChange: (lines: InvoiceLineRow[]) => void;
  allLinesForIssueScan: InvoiceLineRow[];
  enableVirtualization: boolean;
  onSimulateStreamBurst: () => void;
};

const InvoiceLineItemsPanel = ({
  allLines,
  onAllLinesChange,
  allLinesForIssueScan,
  enableVirtualization,
  onSimulateStreamBurst,
}: InvoiceLineItemsPanelProps): React.ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<Identifier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exceptionsOnly, setExceptionsOnly] = useState(false);
  const [windowAnchor, setWindowAnchor] = useState<number | null>(null);
  const [jumpHighlightLineId, setJumpHighlightLineId] = useState<string | null>(null);
  const [aggregateMessage, setAggregateMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deferredScanPool = useDeferredValue(allLinesForIssueScan);
  const [issueLineIds, setIssueLineIds] = useState<Set<string>>(() => new Set());
  const [validationByLineId, setValidationByLineId] = useState<Map<string, LineValidationIssues>>(
    () => new Map(),
  );
  const [scanPending, setScanPending] = useState(false);

  useEffect(() => {
    setScanPending(true);
    const timer = window.setTimeout(() => {
      const crossDoc = computeCrossDocumentIssueLineIds(deferredScanPool);
      setIssueLineIds(crossDoc);
      setValidationByLineId(computeLineValidationIssues(allLines, crossDoc));
      setScanPending(false);
    }, ISSUES_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [deferredScanPool, allLines]);

  const visibleLines = useMemo(() => {
    if (enableVirtualization) {
      return allLines;
    }
    return sliceInvoiceLinesViewWindow({
      allLines,
      anchorLineNumber: windowAnchor,
      exceptionsOnly,
      issueLineIds,
    });
  }, [allLines, windowAnchor, exceptionsOnly, issueLineIds, enableVirtualization]);

  const tableData = useMemo(() => ({ nodes: visibleLines }), [visibleLines]);

  const windowKey = enableVirtualization
    ? 'virtualized'
    : exceptionsOnly
      ? 'exceptions'
      : `anchor-${windowAnchor ?? 'top'}`;

  const applySearch = (query: string): void => {
    setSearchQuery(query);
    if (query.trim()) {
      setExceptionsOnly(false);
    }
    const jumpSerial =
      resolveInvoiceLineJumpSerial(query, allLines) ??
      findFirstTextSearchMatchSerial(query, allLines);
    if (jumpSerial != null) {
      setWindowAnchor(jumpSerial);
      const target = allLines.find((line) => line.lineNumber === jumpSerial);
      if (target) {
        setJumpHighlightLineId(String(target.id));
      }
    }
  };

  const confirmDeleteSelected = (): void => {
    const deletedIds = new Set(selectedIds.map(String));
    onAllLinesChange(renumberInvoiceLinesAfterDelete(allLines, deletedIds));
    setSelectedIds([]);
    setIsDeleteModalOpen(false);
  };

  const onExceptionsOnlyChange = ({ isChecked }: { isChecked: boolean }): void => {
    setExceptionsOnly(isChecked);
    if (isChecked) {
      setSearchQuery('');
      setWindowAnchor(null);
      setJumpHighlightLineId(null);
    }
  };

  useEffect(() => {
    if (!jumpHighlightLineId || !scrollRef.current) {
      return;
    }
    const cell = scrollRef.current.querySelector(`[data-line-id="${jumpHighlightLineId}"]`);
    if (!(cell instanceof HTMLElement)) {
      return;
    }
    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    container.scrollTo({
      top: container.scrollTop + (cellRect.top - containerRect.top) - STICKY_HEADER_PX,
      left:
        container.scrollLeft +
        (cellRect.left - containerRect.left) -
        STICKY_FIRST_COL_PX,
      behavior: 'smooth',
    });
  }, [jumpHighlightLineId, visibleLines, windowKey]);

  const headerRow = (
    <TableHeader>
      <TableHeaderRow>
        {HEADER_COLUMNS.map((column) => (
          <TableHeaderCell key={column.label} headerKey={column.headerKey}>
            <TableHeaderTitleWithInfo title={column.label} infoTooltip={column.infoTooltip} />
          </TableHeaderCell>
        ))}
      </TableHeaderRow>
    </TableHeader>
  );

  const bodyContent = enableVirtualization ? (
    <TableBody>{(row) => (
      <LineItemRow
        key={row.id}
        row={row}
        showCrossDocBadge={issueLineIds.has(String(row.id))}
        validationIssues={validationByLineId.get(String(row.id))}
        jumpHighlight={jumpHighlightLineId === String(row.id)}
        onViewAggregateLines={(item) =>
          setAggregateMessage(`Aggregate drawer for ${item.sku} (${item.aggregatedSourceCount} lines)`)
        }
      />
    )}</TableBody>
  ) : (
    <TableBody>
      {visibleLines.map((row) => (
        <LineItemRow
          key={row.id}
          row={row}
          showCrossDocBadge={issueLineIds.has(String(row.id))}
          validationIssues={validationByLineId.get(String(row.id))}
          jumpHighlight={jumpHighlightLineId === String(row.id)}
          onViewAggregateLines={(item) =>
            setAggregateMessage(`Aggregate drawer for ${item.sku} (${item.aggregatedSourceCount} lines)`)
          }
        />
      ))}
    </TableBody>
  );

  const toolbar = (
    <TableToolbar title="Invoice lines">
      <TableToolbarSearch placeholder="Search or jump (#15, s:15, S.No 15)" />
      <TableToolbarActions>
        <Checkbox isChecked={exceptionsOnly} onChange={onExceptionsOnlyChange}>
          Exceptions only
        </Checkbox>
        <Button
          size="small"
          variant="secondary"
          isDisabled={selectedIds.length === 0}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete selected
        </Button>
        <Button size="small" variant="tertiary" onClick={onSimulateStreamBurst}>
          Re-run scan
        </Button>
      </TableToolbarActions>
    </TableToolbar>
  );

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        gap="spacing.3"
        paddingY="spacing.3"
      >
        <Text size="small" color="surface.text.gray.muted">
          {enableVirtualization
            ? `${allLines.length} lines (virtualized)`
            : exceptionsOnly
              ? `${visibleLines.length} exception lines (unpaged)`
              : `${visibleLines.length} of ${allLines.length} lines in view (max ${INVOICE_LINE_VIEW_PAGE_SIZE})`}
          {' · '}
          Selection: {selectedIds.length} (stored in panel, not Table)
          {' · '}
          Validation scan: {scanPending ? `pending (${ISSUES_DEBOUNCE_MS}ms)` : `${issueLineIds.size} cross-doc`}
          {' · '}
          Editable cells: Tab / arrow keys to move (when focused in a cell)
        </Text>
      </Box>

      {aggregateMessage ? (
        <Box paddingBottom="spacing.2">
          <Text size="small" color="surface.text.gray.muted">
            {aggregateMessage}
          </Text>
        </Box>
      ) : null}

      <Modal isOpen={isDeleteModalOpen} onDismiss={() => setIsDeleteModalOpen(false)} size="small">
        <ModalHeader title="Delete invoice lines?" />
        <ModalBody>
          <Text>
            Remove {selectedIds.length} line{selectedIds.length === 1 ? '' : 's'} from this invoice?
            Remaining lines are re-numbered (highest S.No at top).
          </Text>
        </ModalBody>
        <ModalFooter>
          <Box display="flex" flexDirection="row" gap="spacing.3" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button color="negative" onClick={confirmDeleteSelected}>
              Delete
            </Button>
          </Box>
        </ModalFooter>
      </Modal>

      <Box
        ref={scrollRef}
        overflow="auto"
        maxHeight="520px"
        onKeyDownCapture={(event) => {
          if (!scrollRef.current) {
            return;
          }
          handleInvoiceLineCellKeyDown({
            event,
            root: scrollRef.current,
            visibleLines,
          });
        }}
      >
        <Table
          key={windowKey}
          data={tableData}
          showBorderedCells
          isHeaderSticky
          isFirstColumnSticky
          stickyColumnWidths={[`${STICKY_FIRST_COL_PX}px`]}
          height="480px"
          selectionType="multiple"
          multiSelectTrigger="checkbox"
          selectedIds={selectedIds}
          onSelectionChange={({ selectedIds: ids }) => setSelectedIds(ids)}
          globalFilterValue={searchQuery}
          onGlobalFilterValueChange={applySearch}
          gridTemplateColumns={`${STICKY_FIRST_COL_PX}px minmax(120px, 1fr) minmax(160px, 1.4fr) minmax(128px, 1fr) minmax(140px, 1fr) minmax(72px, 0.7fr) minmax(64px, 0.6fr) minmax(72px, 0.7fr) minmax(88px, 0.8fr) minmax(96px, 0.85fr) minmax(112px, 1fr) minmax(96px, 0.8fr)`}
          toolbar={toolbar}
        >
          {() =>
            enableVirtualization ? (
              <TableVirtualizedWrapper>
                {headerRow}
                {bodyContent}
              </TableVirtualizedWrapper>
            ) : (
              <>
                {headerRow}
                {bodyContent}
              </>
            )
          }
        </Table>
      </Box>
    </Box>
  );
};

const LineItemsTemplate: StoryFn<LineItemsStoryArgs> = ({ lineCount, enableVirtualization }) => {
  const [streamTick, setStreamTick] = useState(0);
  const [invoiceLines, setInvoiceLines] = useState<InvoiceLineRow[]>(() =>
    buildInvoiceLineTableData(lineCount, 0).nodes,
  );

  useEffect(() => {
    setInvoiceLines(buildInvoiceLineTableData(lineCount, streamTick).nodes);
  }, [lineCount, streamTick]);

  const allLinesForIssueScan = useMemo(() => {
    const siblingDocLines = buildInvoiceLineTableData(Math.min(lineCount, 80), streamTick + 1).nodes.map(
      (line, index) => ({
        ...line,
        id: `sibling-${index}-${streamTick}`,
      }),
    );
    return [...invoiceLines, ...siblingDocLines];
  }, [invoiceLines, lineCount, streamTick]);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="560px"
    >
      <Box paddingBottom="spacing.4" maxWidth="920px">
        <Heading marginBottom="spacing.2">Line items (invoice interaction)</Heading>
        <Text color="surface.text.gray.muted">
          Checkbox multi-select with state in the panel; inline text + dropdown cells; debounced
          validation; exceptions-only vs jump search; delete confirmation + re-number; Tab/arrow cell
          navigation; 30-row view windows (or virtualization at scale). Clearance queue patterns live
          in <Text as="span" weight="semibold">All use cases</Text>.
        </Text>
      </Box>
      <InvoiceLineItemsPanel
        allLines={invoiceLines}
        onAllLinesChange={setInvoiceLines}
        allLinesForIssueScan={allLinesForIssueScan}
        enableVirtualization={enableVirtualization}
        onSimulateStreamBurst={() => setStreamTick((value) => value + 1)}
      />
    </Box>
  );
};

export const UnpaginatedInvoiceLines = LineItemsTemplate.bind({});
UnpaginatedInvoiceLines.storyName = 'Invoice line items (full)';

UnpaginatedInvoiceLines.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('heading', { name: /Line items \(invoice interaction\)/i })).toBeVisible();

  const rowCheckboxes = canvas.getAllByRole('checkbox');
  await userEvent.click(rowCheckboxes[1]);
  await userEvent.click(canvas.getByRole('button', { name: 'Delete selected' }));
  await expect(canvas.getByText(/Remove 1 line from this invoice/i)).toBeVisible();
  await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
  await waitFor(() => {
    expect(canvas.queryByText(/Remove 1 line from this invoice/i)).not.toBeInTheDocument();
  });

  const descriptionField = canvas.getAllByLabelText('Description')[0];
  await userEvent.click(descriptionField);
  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getAllByLabelText('HTS code')[0]).toHaveFocus();
};

applyTableFlagshipRecipeMeta(storyMeta);
export default storyMeta;
