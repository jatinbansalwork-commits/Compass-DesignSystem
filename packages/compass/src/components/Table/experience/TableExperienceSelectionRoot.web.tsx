import React, { useCallback, useRef } from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { Identifier } from '../types';

type TableExperienceSelectionRootProps = {
  children: React.ReactNode;
  /** Visible row ids in display order (current page after filter). */
  rowIds: Identifier[];
  selectedIds: Identifier[];
  onSelectedIdsChange: (ids: Identifier[]) => void;
  enabled?: boolean;
};

const isMetaKey = (event: React.MouseEvent | React.KeyboardEvent): boolean =>
  event.metaKey || event.ctrlKey;

/**
 * Prime-style modifier selection: Ctrl/Cmd+click toggles a row; Shift+click selects a range.
 * Row elements should expose `data-table-experience-row-id` (see {@link TableExperienceRow}).
 */
const TableExperienceSelectionRoot = ({
  children,
  rowIds,
  selectedIds,
  onSelectedIdsChange,
  enabled = true,
}: TableExperienceSelectionRootProps): React.ReactElement => {
  const anchorIdRef = useRef<Identifier | null>(null);

  const toggleId = useCallback(
    (id: Identifier, additive: boolean): void => {
      if (!additive) {
        onSelectedIdsChange([id]);
        anchorIdRef.current = id;
        return;
      }
      if (selectedIds.includes(id)) {
        onSelectedIdsChange(selectedIds.filter((selected) => selected !== id));
      } else {
        onSelectedIdsChange([...selectedIds, id]);
      }
      anchorIdRef.current = id;
    },
    [onSelectedIdsChange, selectedIds],
  );

  const selectRange = useCallback(
    (targetId: Identifier): void => {
      const anchorId = anchorIdRef.current ?? selectedIds[selectedIds.length - 1] ?? rowIds[0];
      const anchorIndex = rowIds.indexOf(anchorId);
      const targetIndex = rowIds.indexOf(targetId);
      if (anchorIndex === -1 || targetIndex === -1) {
        toggleId(targetId, true);
        return;
      }
      const [start, end] =
        anchorIndex <= targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex];
      const rangeIds = rowIds.slice(start, end + 1);
      const merged = new Set([...selectedIds, ...rangeIds]);
      onSelectedIdsChange([...merged]);
      anchorIdRef.current = targetId;
    },
    [onSelectedIdsChange, rowIds, selectedIds, toggleId],
  );

  const onPointerDownCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (!enabled) {
        return;
      }
      const target = event.target as HTMLElement;
      const rowEl = target.closest('[data-table-experience-row-id]');
      if (!rowEl) {
        return;
      }
      const rowId = rowEl.getAttribute('data-table-experience-row-id');
      if (!rowId) {
        return;
      }
      const id: Identifier = Number.isNaN(Number(rowId)) ? rowId : Number(rowId);
      if (event.shiftKey) {
        event.preventDefault();
        selectRange(id);
        return;
      }
      if (isMetaKey(event)) {
        event.preventDefault();
        toggleId(id, true);
      }
    },
    [enabled, selectRange, toggleId],
  );

  return (
    <BaseBox onMouseDownCapture={onPointerDownCapture} width="100%">
      {children}
    </BaseBox>
  );
};

export { TableExperienceSelectionRoot };
