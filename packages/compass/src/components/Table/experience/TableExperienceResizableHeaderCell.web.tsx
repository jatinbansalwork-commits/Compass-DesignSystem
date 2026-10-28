import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';

const ResizeHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  touch-action: none;
  user-select: none;
`;

type TableExperienceResizableHeaderCellProps = {
  columnKey: string;
  widthPx: number;
  minWidthPx?: number;
  onWidthChange: (columnKey: string, widthPx: number) => void;
  children: React.ReactNode;
};

/**
 * Wraps a {@link TableHeaderCell} (or cell content) with a drag handle on the trailing edge.
 */
const TableExperienceResizableHeaderCell = ({
  columnKey,
  widthPx,
  minWidthPx = 80,
  onWidthChange,
  children,
}: TableExperienceResizableHeaderCellProps): React.ReactElement => {
  const startXRef = useRef(0);
  const startWidthRef = useRef(widthPx);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      startXRef.current = event.clientX;
      startWidthRef.current = widthPx;
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);

      const onPointerMove = (moveEvent: PointerEvent): void => {
        const delta = moveEvent.clientX - startXRef.current;
        onWidthChange(columnKey, Math.max(minWidthPx, startWidthRef.current + delta));
      };

      const onPointerUp = (): void => {
        target.releasePointerCapture(event.pointerId);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    },
    [columnKey, minWidthPx, onWidthChange, widthPx],
  );

  return (
    <BaseBox position="relative" width="100%" height="100%">
      {children}
      <ResizeHandle
        role="separator"
        aria-orientation="vertical"
        aria-label={`Resize ${columnKey} column`}
        data-table-experience-resize-handle={columnKey}
        onPointerDown={onPointerDown}
      />
    </BaseBox>
  );
};

export { TableExperienceResizableHeaderCell };
