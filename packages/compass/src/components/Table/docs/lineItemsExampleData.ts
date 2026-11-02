import type { TableData, TableNode } from '../types';
import type { LineValidationIssues } from './invoiceLineItemsViewUtils';

type InvoiceLineItem = {
  lineNumber: number;
  sku: string;
  description: string;
  htsCode: string;
  manufacturer: string;
  coo: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  dutyAmount: number;
  poReference: string;
  /** When set, row is an aggregated merge — SKU cell shows badges instead of inline edit. */
  aggregatedSourceCount?: number;
};

type InvoiceLineRow = TableNode<InvoiceLineItem>;

const HTS_OPTIONS = [
  '8471.30.0100',
  '2933.99.8200',
  '8703.23.0190',
  '4011.10.1000',
  '7304.59.6000',
  '8542.31.0075',
];

const DESCRIPTIONS = [
  'Lithium-ion battery module',
  'Industrial valve assembly',
  'Printed circuit board',
  'Steel pipe fitting',
  'Optical sensor kit',
  'Polymer resin granules',
];

const MANUFACTURERS = [
  'Acme Manufacturing',
  'Global Apparel Co.',
  'Pacific Components Ltd.',
  'Northstar Industrial',
];

const COO_OPTIONS = ['CN', 'IN', 'VN', 'MX', 'DE', 'US'];
const UOM_OPTIONS = ['EA', 'KG', 'M', 'L', 'SET'];

const buildInvoiceLineNodes = (count: number, idOffset = 0, seed = 0): InvoiceLineRow[] =>
  Array.from({ length: count }, (_, index) => {
    const lineNumber = index + 1;
    const aggregatedSourceCount =
      lineNumber === 5 ? 4 : lineNumber === 12 ? 3 : undefined;
    return {
      id: `line-${idOffset + index + 1}`,
      lineNumber,
      sku: aggregatedSourceCount
        ? `AGG-${String(lineNumber).padStart(3, '0')}`
        : `SKU-${String(1000 + lineNumber + seed).padStart(5, '0')}`,
      description: DESCRIPTIONS[(index + seed) % DESCRIPTIONS.length],
      htsCode: HTS_OPTIONS[(index + idOffset + seed) % HTS_OPTIONS.length],
      manufacturer: MANUFACTURERS[(index + seed) % MANUFACTURERS.length],
      coo: COO_OPTIONS[(index + idOffset) % COO_OPTIONS.length],
      uom: UOM_OPTIONS[index % UOM_OPTIONS.length],
      quantity: 1 + ((index * 3 + seed) % 48),
      unitPrice: Number((40 + ((index * 11 + seed) % 200)).toFixed(2)),
      dutyAmount: Number((120 + ((index * 17 + seed * 3) % 400)).toFixed(2)),
      poReference: `PO-${202400 + lineNumber}`,
      aggregatedSourceCount,
    };
  });

const buildInvoiceLineTableData = (lineCount: number, seed = 0): TableData<InvoiceLineItem> => ({
  nodes: buildInvoiceLineNodes(lineCount, 0, seed),
});

/**
 * Simulates a cross-document scan (all lines on the invoice + sibling docs).
 * Rows whose HTS appears more than once in the pool get an exception badge.
 */
const computeCrossDocumentIssueLineIds = (allLines: InvoiceLineRow[]): Set<string> => {
  const htsCounts = new Map<string, number>();
  allLines.forEach((line) => {
    htsCounts.set(line.htsCode, (htsCounts.get(line.htsCode) ?? 0) + 1);
  });
  const duplicatedHts = new Set(
    [...htsCounts.entries()].filter(([, count]) => count > 1).map(([hts]) => hts),
  );
  return new Set(
    allLines.filter((line) => duplicatedHts.has(line.htsCode)).map((line) => String(line.id)),
  );
};

/** Demo validation map — empty HTS/description or low quantity flagged after debounced scan. */
const computeLineValidationIssues = (
  lines: InvoiceLineRow[],
  crossDocIssueIds: Set<string>,
): Map<string, LineValidationIssues> => {
  const map = new Map<string, LineValidationIssues>();
  lines.forEach((line) => {
    const issues: LineValidationIssues = {};
    if (!line.description.trim()) {
      issues.description = { severity: 'blocker', message: 'Description is required' };
    }
    if (line.quantity < 2) {
      issues.quantity = { severity: 'warning', message: 'Quantity unusually low' };
    }
    if (crossDocIssueIds.has(String(line.id))) {
      issues.htsCode = {
        severity: 'blocker',
        message: 'HTS also appears on a sibling document in this entry',
      };
    }
    if (Object.keys(issues).length > 0) {
      map.set(String(line.id), issues);
    }
  });
  return map;
};

export type { InvoiceLineItem, InvoiceLineRow };
export {
  HTS_OPTIONS,
  MANUFACTURERS,
  COO_OPTIONS,
  UOM_OPTIONS,
  buildInvoiceLineNodes,
  buildInvoiceLineTableData,
  computeCrossDocumentIssueLineIds,
  computeLineValidationIssues,
};
