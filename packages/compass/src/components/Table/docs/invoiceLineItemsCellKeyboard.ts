import type { InvoiceLineRow } from './lineItemsExampleData';

const INVOICE_LINE_EDIT_FIELDS = [
  'sku',
  'description',
  'htsCode',
  'manufacturer',
  'coo',
  'uom',
  'quantity',
  'unitPrice',
  'poReference',
] as const;

type InvoiceLineEditField = (typeof INVOICE_LINE_EDIT_FIELDS)[number];

const getEditableFieldsForLine = (row: InvoiceLineRow): InvoiceLineEditField[] => {
  if (row.aggregatedSourceCount) {
    return INVOICE_LINE_EDIT_FIELDS.filter((field) => field !== 'sku');
  }
  return [...INVOICE_LINE_EDIT_FIELDS];
};

const focusInvoiceLineCell = (
  root: HTMLElement,
  lineId: string,
  field: InvoiceLineEditField,
): boolean => {
  const host = root.querySelector(
    `[data-invoice-line-cell][data-line-id="${CSS.escape(String(lineId))}"][data-field="${field}"]`,
  );
  if (!(host instanceof HTMLElement)) {
    return false;
  }
  const focusable = host.querySelector<HTMLElement>(
    'input:not([type="hidden"]), textarea, [role="combobox"], button:not([disabled])',
  );
  if (!focusable) {
    return false;
  }
  focusable.focus();
  return true;
};

const handleInvoiceLineCellKeyDown = ({
  event,
  root,
  visibleLines,
}: {
  event: React.KeyboardEvent<HTMLElement>;
  root: HTMLElement;
  visibleLines: InvoiceLineRow[];
}): void => {
  const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'];
  if (!navigationKeys.includes(event.key)) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const host = target.closest('[data-invoice-line-cell]');
  if (!(host instanceof HTMLElement)) {
    return;
  }

  const lineId = host.getAttribute('data-line-id');
  const field = host.getAttribute('data-field') as InvoiceLineEditField | null;
  if (!lineId || !field) {
    return;
  }

  const rowIndex = visibleLines.findIndex((line) => String(line.id) === lineId);
  if (rowIndex === -1) {
    return;
  }

  const rowFields = getEditableFieldsForLine(visibleLines[rowIndex]);
  const fieldIndex = rowFields.indexOf(field);
  if (fieldIndex === -1) {
    return;
  }

  let nextRowIndex = rowIndex;
  let nextFieldIndex = fieldIndex;

  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      nextFieldIndex -= 1;
      if (nextFieldIndex < 0) {
        nextRowIndex -= 1;
        if (nextRowIndex < 0) {
          return;
        }
        nextFieldIndex = getEditableFieldsForLine(visibleLines[nextRowIndex]).length - 1;
      }
    } else {
      nextFieldIndex += 1;
      if (nextFieldIndex >= rowFields.length) {
        nextRowIndex += 1;
        if (nextRowIndex >= visibleLines.length) {
          return;
        }
        nextFieldIndex = 0;
      }
    }
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextFieldIndex = Math.min(rowFields.length - 1, fieldIndex + 1);
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault();
    nextFieldIndex = Math.max(0, fieldIndex - 1);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    nextRowIndex = Math.min(visibleLines.length - 1, rowIndex + 1);
    const nextFields = getEditableFieldsForLine(visibleLines[nextRowIndex]);
    nextFieldIndex = Math.min(fieldIndex, nextFields.length - 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    nextRowIndex = Math.max(0, rowIndex - 1);
    const nextFields = getEditableFieldsForLine(visibleLines[nextRowIndex]);
    nextFieldIndex = Math.min(fieldIndex, nextFields.length - 1);
  }

  const nextRow = visibleLines[nextRowIndex];
  const nextFields = getEditableFieldsForLine(nextRow);
  const nextField = nextFields[nextFieldIndex];
  if (!nextField) {
    return;
  }

  focusInvoiceLineCell(root, String(nextRow.id), nextField);
};

export type { InvoiceLineEditField };
export {
  INVOICE_LINE_EDIT_FIELDS,
  getEditableFieldsForLine,
  focusInvoiceLineCell,
  handleInvoiceLineCellKeyDown,
};
