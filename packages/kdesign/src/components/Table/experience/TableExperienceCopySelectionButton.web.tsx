import React, { useCallback } from 'react';
import { Button } from '~components/Button';
import type { Identifier, TableNode } from '../types';

type TableExperienceCopySelectionButtonProps<Item> = {
  rows: TableNode<Item>[];
  selectedIds: Identifier[];
  getCellText: (row: TableNode<Item>) => string;
  label?: string;
  isDisabled?: boolean;
};

const TableExperienceCopySelectionButton = <Item,>({
  rows,
  selectedIds,
  getCellText,
  label = 'Copy IDs',
  isDisabled = false,
}: TableExperienceCopySelectionButtonProps<Item>): React.ReactElement => {
  const onCopy = useCallback((): void => {
    const idSet = new Set(selectedIds.map(String));
    const lines = rows.filter((row) => idSet.has(String(row.id))).map(getCellText);
    if (lines.length === 0) {
      return;
    }
    void navigator.clipboard?.writeText(lines.join('\n'));
  }, [getCellText, rows, selectedIds]);

  return (
    <Button
      size="small"
      variant="secondary"
      onClick={onCopy}
      isDisabled={isDisabled || selectedIds.length === 0}
      testID="table-experience-copy-selection"
    >
      {label}
    </Button>
  );
};

export { TableExperienceCopySelectionButton };
