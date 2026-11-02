import type { InvoiceLineRow } from './lineItemsExampleData';

const INVOICE_LINE_VIEW_PAGE_SIZE = 30;

type LineFieldIssue = {
  severity: 'blocker' | 'warning';
  message: string;
};

type LineValidationIssues = Partial<
  Record<
    | 'description'
    | 'htsCode'
    | 'sku'
    | 'manufacturer'
    | 'coo'
    | 'uom'
    | 'quantity'
    | 'unitPrice'
    | 'poReference',
    LineFieldIssue
  >
>;

/** Display order: highest line number first (invoice convention). */
const sortLinesBySerialDesc = (lines: InvoiceLineRow[]): InvoiceLineRow[] =>
  [...lines].sort((a, b) => b.lineNumber - a.lineNumber);

const sliceInvoiceLinesViewWindow = ({
  allLines,
  anchorLineNumber,
  exceptionsOnly,
  issueLineIds,
}: {
  allLines: InvoiceLineRow[];
  anchorLineNumber: number | null;
  exceptionsOnly: boolean;
  issueLineIds: Set<string>;
}): InvoiceLineRow[] => {
  const sorted = sortLinesBySerialDesc(allLines);

  if (exceptionsOnly) {
    return sorted.filter((line) => issueLineIds.has(String(line.id)));
  }

  if (anchorLineNumber == null) {
    return sorted.slice(0, INVOICE_LINE_VIEW_PAGE_SIZE);
  }

  const anchorIndex = sorted.findIndex((line) => line.lineNumber === anchorLineNumber);
  if (anchorIndex === -1) {
    return sorted.slice(0, INVOICE_LINE_VIEW_PAGE_SIZE);
  }

  const start = Math.max(0, anchorIndex - Math.floor(INVOICE_LINE_VIEW_PAGE_SIZE / 2));
  return sorted.slice(start, start + INVOICE_LINE_VIEW_PAGE_SIZE);
};

const resolveInvoiceLineJumpSerial = (
  query: string,
  lines: InvoiceLineRow[],
): number | null => {
  const trimmed = query.trim();
  if (!trimmed) {
    return null;
  }

  const hashMatch = /^#(\d+)$/.exec(trimmed);
  if (hashMatch) {
    return Number(hashMatch[1]);
  }

  const sColonMatch = /^s:(\d+)$/i.exec(trimmed);
  if (sColonMatch) {
    return Number(sColonMatch[1]);
  }

  const sNoMatch = /^S\.?\s*No\.?\s*(\d+)$/i.exec(trimmed);
  if (sNoMatch) {
    return Number(sNoMatch[1]);
  }

  if (/^\d+$/.test(trimmed)) {
    const serial = Number(trimmed);
    return lines.some((line) => line.lineNumber === serial) ? serial : null;
  }

  return null;
};

const findFirstTextSearchMatchSerial = (
  query: string,
  lines: InvoiceLineRow[],
): number | null => {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return null;
  }

  const sorted = sortLinesBySerialDesc(lines);
  const match = sorted.find((line) => {
    const haystack = [
      line.sku,
      line.description,
      line.htsCode,
      line.manufacturer,
      line.coo,
      line.uom,
      line.poReference,
      String(line.quantity),
      String(line.unitPrice),
      String(line.dutyAmount),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(needle);
  });

  return match?.lineNumber ?? null;
};

/** Re-sequence line numbers (highest first) after removing rows. */
const renumberInvoiceLinesAfterDelete = (
  lines: InvoiceLineRow[],
  deletedIds: Set<string>,
): InvoiceLineRow[] => {
  const remaining = sortLinesBySerialDesc(lines.filter((line) => !deletedIds.has(String(line.id))));
  const total = remaining.length;
  return remaining.map((line, index) => ({
    ...line,
    lineNumber: total - index,
  }));
};

export type { LineFieldIssue, LineValidationIssues };
export {
  INVOICE_LINE_VIEW_PAGE_SIZE,
  sortLinesBySerialDesc,
  sliceInvoiceLinesViewWindow,
  resolveInvoiceLineJumpSerial,
  findFirstTextSearchMatchSerial,
  renumberInvoiceLinesAfterDelete,
};
