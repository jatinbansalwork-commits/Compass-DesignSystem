import type { TableExperienceExportColumn } from './types';
import type { TableNode } from '../types';

const escapeCsvCell = (value: string): string => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

const exportTableToCsv = <Item>(
  rows: TableNode<Item>[],
  columns: TableExperienceExportColumn<Item>[],
): string => {
  const headerLine = columns.map((column) => escapeCsvCell(column.header)).join(',');
  const bodyLines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(column.getValue(row))).join(','),
  );
  return [headerLine, ...bodyLines].join('\n');
};

const downloadCsvFile = (csvContent: string, fileName: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export { exportTableToCsv, downloadCsvFile, escapeCsvCell };
