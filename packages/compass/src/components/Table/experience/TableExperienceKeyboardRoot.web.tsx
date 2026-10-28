import React, { useCallback, useEffect, useRef, useState } from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { Identifier } from '../types';
import { TableExperienceKeyboardProvider } from './TableExperienceKeyboardContext';

type TableExperienceKeyboardRootProps = {
  children: React.ReactNode;
  rowIds: Identifier[];
  enabled?: boolean;
  selectionType?: 'none' | 'single' | 'multiple';
  selectedIds?: Identifier[];
  onSelectedIdsChange?: (ids: Identifier[]) => void;
};

const rowIdEquals = (a: Identifier, b: Identifier): boolean => String(a) === String(b);

/**
 * Roving keyboard focus across {@link TableExperienceRow} (`data-table-experience-row-id`).
 * Arrow Up/Down moves focus; Space/Enter toggles selection when `selectionType` is `multiple`.
 */
const TableExperienceKeyboardRoot = ({
  children,
  rowIds,
  enabled = true,
  selectionType = 'none',
  selectedIds = [],
  onSelectedIdsChange,
}: TableExperienceKeyboardRootProps): React.ReactElement => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedIndex >= rowIds.length) {
      setFocusedIndex(Math.max(0, rowIds.length - 1));
    }
  }, [focusedIndex, rowIds.length]);

  const focusedRowId = rowIds[focusedIndex] ?? null;

  const toggleSelection = useCallback(
    (id: Identifier): void => {
      if (selectionType !== 'multiple' || !onSelectedIdsChange) {
        return;
      }
      if (selectedIds.some((selected) => rowIdEquals(selected, id))) {
        onSelectedIdsChange(selectedIds.filter((selected) => !rowIdEquals(selected, id)));
      } else {
        onSelectedIdsChange([...selectedIds, id]);
      }
    },
    [onSelectedIdsChange, selectedIds, selectionType],
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (!enabled || rowIds.length === 0) {
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusedIndex((index) => Math.min(rowIds.length - 1, index + 1));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusedIndex((index) => Math.max(0, index - 1));
        return;
      }
      if (event.key === ' ' || event.key === 'Enter') {
        if (focusedRowId == null) {
          return;
        }
        event.preventDefault();
        toggleSelection(focusedRowId);
      }
    },
    [enabled, focusedRowId, rowIds.length, toggleSelection],
  );

  return (
    <TableExperienceKeyboardProvider focusedRowId={focusedRowId}>
      <BaseBox
        ref={rootRef}
        width="100%"
        tabIndex={enabled ? 0 : undefined}
        onKeyDown={onKeyDown}
        data-table-experience-keyboard-root=""
      >
        {children}
      </BaseBox>
    </TableExperienceKeyboardProvider>
  );
};

export { TableExperienceKeyboardRoot };
