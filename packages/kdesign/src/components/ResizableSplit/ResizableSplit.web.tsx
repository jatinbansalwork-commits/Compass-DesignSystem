import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ResizableSplitHandle } from './ResizableSplitHandle.web';
import { ComponentIds } from './componentIds';
import { buildSplitGridTemplate } from './splitLayout';
import { HANDLE_SIZE_CONFIG, resolveHandleTrackSize } from './handleSizeTokens';
import type { ResizableSplitProps, ResizableSplitPaneProps } from './types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useResize } from '~utils/useResize';
import clamp from '~utils/lodashButBetter/clamp';

const DEFAULT_MIN_PANE_SIZE = 320;
const DEFAULT_STEP = 16;

const StyledSplit = styled.div<{
  $gridTemplateColumns?: string;
  $gridTemplateRows?: string;
}>(({ $gridTemplateColumns, $gridTemplateRows }) => ({
  display: 'grid',
  ...( $gridTemplateColumns ? { gridTemplateColumns: $gridTemplateColumns } : undefined),
  ...( $gridTemplateRows ? { gridTemplateRows: $gridTemplateRows } : undefined),
  width: '100%',
  height: '100%',
  minWidth: 0,
  minHeight: 0,
}));

const StyledPane = styled.div({
  minWidth: 0,
  minHeight: 0,
  overflow: 'auto',
  contain: 'layout',
});

const _ResizableSplitPane = ({
  children,
  testID,
  ...rest
}: ResizableSplitPaneProps): React.ReactElement => (
  <StyledPane
    {...metaAttribute({ name: MetaConstants.ResizableSplitPane, testID })}
    {...makeAnalyticsAttribute(rest)}
  >
    {children}
  </StyledPane>
);

const ResizableSplitPane = memo(
  assignWithoutSideEffects(_ResizableSplitPane, {
    displayName: 'ResizableSplitPane',
    componentId: ComponentIds.ResizableSplitPane,
  }),
);

const defaultComputeDefaultWidth = (containerWidth: number): number => containerWidth * 0.4;
const defaultComputeDefaultHeight = (containerHeight: number): number => containerHeight * 0.4;

const clearInlineGrid = (el: HTMLDivElement | null): void => {
  el?.style.removeProperty('grid-template-columns');
  el?.style.removeProperty('grid-template-rows');
};

const applyInlineGrid = (
  el: HTMLDivElement | null,
  template: { gridTemplateColumns?: string; gridTemplateRows?: string },
): void => {
  if (!el) return;
  if (template.gridTemplateColumns) {
    el.style.gridTemplateColumns = template.gridTemplateColumns;
  }
  if (template.gridTemplateRows) {
    el.style.gridTemplateRows = template.gridTemplateRows;
  }
};

const _ResizableSplit = ({
  children,
  width,
  onWidthChange,
  onResizeEnd,
  orientation = 'horizontal',
  handleSize = 'medium',
  computeDefaultSize,
  computeDefaultWidth = defaultComputeDefaultWidth,
  computeDefaultHeight = defaultComputeDefaultHeight,
  minStartWidth = DEFAULT_MIN_PANE_SIZE,
  minEndWidth = DEFAULT_MIN_PANE_SIZE,
  handleWidth,
  step = DEFAULT_STEP,
  accessibilityLabel,
  testID,
  ...rest
}: ResizableSplitProps): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const onContainerResize = useCallback((entry: ResizeObserverEntry) => {
    setContainerSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    });
  }, []);

  useResize(containerRef, onContainerResize);

  const handleTrackSize = resolveHandleTrackSize(handleSize, handleWidth);
  const gripConfig = HANDLE_SIZE_CONFIG[handleSize];

  const containerPrimarySize =
    orientation === 'vertical' ? containerSize.height : containerSize.width;

  const maxEndSize = Math.max(
    minEndWidth,
    containerPrimarySize - minStartWidth - handleTrackSize,
  );

  const clampEndSize = useCallback(
    (value: number): number => clamp(value, minEndWidth, maxEndSize),
    [minEndWidth, maxEndSize],
  );

  const defaultEndSize = useCallback((): number => {
    if (computeDefaultSize) {
      return computeDefaultSize(containerPrimarySize);
    }
    if (orientation === 'vertical') {
      return computeDefaultHeight(containerSize.height);
    }
    return computeDefaultWidth(containerSize.width);
  }, [
    computeDefaultSize,
    computeDefaultHeight,
    computeDefaultWidth,
    containerPrimarySize,
    containerSize.height,
    containerSize.width,
    orientation,
  ]);

  const resolvedEndSize =
    width !== null ? clampEndSize(width) : clampEndSize(defaultEndSize());

  const buildGrid = useCallback(
    (endSize: number) =>
      buildSplitGridTemplate({
        orientation,
        minStartSize: minStartWidth,
        handleTrackSize,
        endSize,
      }),
    [handleTrackSize, minStartWidth, orientation],
  );

  const handleChange = useCallback(
    (newSize: number): void => {
      onWidthChange(clampEndSize(newSize));
    },
    [clampEndSize, onWidthChange],
  );

  const handleChangeEnd = useCallback(
    (newSize: number): void => {
      onResizeEnd?.(clampEndSize(newSize));
    },
    [clampEndSize, onResizeEnd],
  );

  const handleDragCommit = useCallback(
    (newSize: number): void => {
      clearInlineGrid(containerRef.current);
      const clamped = clampEndSize(newSize);
      onWidthChange(clamped);
      onResizeEnd?.(clamped);
    },
    [clampEndSize, onResizeEnd, onWidthChange],
  );

  const handleReset = useCallback((): void => {
    clearInlineGrid(containerRef.current);
    onWidthChange(null);
  }, [onWidthChange]);

  const applyVisualEndSize = useCallback(
    (newSize: number): void => {
      applyInlineGrid(containerRef.current, buildGrid(clampEndSize(newSize)));
    },
    [buildGrid, clampEndSize],
  );

  const getEndSizeFromPointer = useCallback(
    (clientX: number, clientY: number): number => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return resolvedEndSize;
      if (orientation === 'vertical') {
        return rect.bottom - clientY;
      }
      return rect.right - clientX;
    },
    [orientation, resolvedEndSize],
  );

  const [startPane, endPane] = React.Children.toArray(children);

  const gridTemplate = useMemo(
    () => buildGrid(resolvedEndSize),
    [buildGrid, resolvedEndSize],
  );

  const valueRange = maxEndSize - minEndWidth;
  const valueNow = valueRange > 0 ? ((resolvedEndSize - minEndWidth) / valueRange) * 100 : 0;
  const sizeUnitLabel = orientation === 'vertical' ? 'tall' : 'wide';

  return (
    <StyledSplit
      ref={containerRef}
      $gridTemplateColumns={gridTemplate.gridTemplateColumns}
      $gridTemplateRows={gridTemplate.gridTemplateRows}
      {...metaAttribute({ name: MetaConstants.ResizableSplit, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {startPane}
      <ResizableSplitHandle
        orientation={orientation}
        handleTrackSize={handleTrackSize}
        gripConfig={gripConfig}
        step={step}
        endSizePx={resolvedEndSize}
        endSizeMinPx={minEndWidth}
        endSizeMaxPx={maxEndSize}
        ariaValueNow={Math.round(valueNow)}
        ariaValueMin={0}
        ariaValueMax={100}
        ariaValueText={`${Math.round(resolvedEndSize)}px ${sizeUnitLabel}`}
        accessibilityLabel={accessibilityLabel}
        onChange={handleChange}
        onVisualEndSizeChange={applyVisualEndSize}
        onChangeEnd={handleChangeEnd}
        onDragCommit={handleDragCommit}
        onReset={handleReset}
        getEndSizeFromPointer={getEndSizeFromPointer}
      />
      {endPane}
    </StyledSplit>
  );
};

const ResizableSplit = assignWithoutSideEffects(_ResizableSplit, {
  displayName: 'ResizableSplit',
  componentId: ComponentIds.ResizableSplit,
});

export { ResizableSplit, ResizableSplitPane };
