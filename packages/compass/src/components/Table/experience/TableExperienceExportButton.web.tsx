import React, { useCallback } from 'react';
import { Button } from '~components/Button';
import { downloadCsvFile, exportTableToCsv } from './exportTableToCsv';
import type { TableExperienceExportColumn } from './types';
import type { TableNode } from '../types';

type TableExperienceExportButtonProps<Item> = {
  rows: TableNode<Item>[];
  columns: TableExperienceExportColumn<Item>[];
  fileName?: string;
  label?: string;
  isDisabled?: boolean;
};

const TableExperienceExportButton = <Item,>({
  rows,
  columns,
  fileName = 'table-export',
  label = 'Export',
  isDisabled = false,
}: TableExperienceExportButtonProps<Item>): React.ReactElement => {
  const onExport = useCallback((): void => {
    const csv = exportTableToCsv(rows, columns);
    downloadCsvFile(csv, fileName);
  }, [rows, columns, fileName]);

  return (
    <Button
      size="small"
      variant="secondary"
      onClick={onExport}
      isDisabled={isDisabled || rows.length === 0}
      testID="table-experience-export"
    >
      {label}
    </Button>
  );
};

export { TableExperienceExportButton };
