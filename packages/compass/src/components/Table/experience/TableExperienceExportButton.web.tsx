import React, { useCallback } from 'react';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { tableIcons } from '../tokens';
import { ExportIcon } from '~components/Icons';
import { Tooltip } from '~components/Tooltip';
import { downloadCsvFile, exportTableToCsv } from './exportTableToCsv';
import type { TableExperienceExportColumn } from './types';
import type { TableNode } from '../types';

type TableExperienceExportButtonProps<Item> = {
  rows: TableNode<Item>[];
  columns: TableExperienceExportColumn<Item>[];
  fileName?: string;
  label?: string;
  isDisabled?: boolean;
  iconOnly?: boolean;
};

const TableExperienceExportButton = <Item,>({
  rows,
  columns,
  fileName = 'table-export',
  label = 'Export',
  isDisabled = false,
  iconOnly = false,
}: TableExperienceExportButtonProps<Item>): React.ReactElement => {
  const onExport = useCallback((): void => {
    const csv = exportTableToCsv(rows, columns);
    downloadCsvFile(csv, fileName);
  }, [rows, columns, fileName]);

  if (iconOnly) {
    return (
      <Tooltip content={label}>
        <IconButton
          size={tableIcons.control}
          icon={ExportIcon}
          accessibilityLabel={label}
          onClick={onExport}
          isDisabled={isDisabled || rows.length === 0}
          testID="table-experience-export"
        />
      </Tooltip>
    );
  }

  return (
    <Button
      size="small"
      variant="secondary"
      onClick={onExport}
      isDisabled={isDisabled || rows.length === 0}
      testID="table-experience-export"
      flexShrink={0}
      whiteSpace="nowrap"
    >
      {label}
    </Button>
  );
};

export { TableExperienceExportButton };
