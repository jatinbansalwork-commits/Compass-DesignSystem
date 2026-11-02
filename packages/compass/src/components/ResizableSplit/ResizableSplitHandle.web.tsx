import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  getHandleContainerStyles,
  getHandleTrackStyles,
  getHandleGripStyles,
} from './getResizableSplitHandleStyles';
import { ComponentIds } from './componentIds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import DragHandleIcon from '~components/Icons/DragHandleIcon';
import clamp from '~utils/lodashButBetter/clamp';

const StyledHandleContainer = styled.div<{ $handleWidth: number; $isFocusVisible: boolean }>(
  ({ theme, $handleWidth, $isFocusVisible }) =>
    getHandleContainerStyles({ theme, handleWidth: $handleWidth, isFocusVisible: $isFocusVisible }),
);

const StyledTrack = styled.div<{ $isDragging: boolean }>(({ theme, $isDragging }) =>
  getHandleTrackStyles({ theme, isDragging: $isDragging }),
);

const StyledGrip = styled.div<{ $isDragging: boolean }>(({ theme, $isDragging }) =>
  getHandleGripStyles({ theme, isDragging: $isDragging }),
);

type ResizableSplitHandleProps = {
  handleWidth: number;
  step: number;
  widthPx: number;
  widthMinPx: number;
  widthMaxPx: number;
  ariaValueNow: number;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueText: string;
  accessibilityLabel: string;
  onChange: (width: number) => void;
  onVisualWidthChange: (width: number) => void;
  onChangeEnd: (width: number) => void;
  onDragCommit: (width: number) => void;
  onReset: () => void;
  getContainerRightEdge: () => number;
};

const toAriaValueNow = (widthPx: number, widthMinPx: number, widthMaxPx: number): number => {
  const range = widthMaxPx - widthMinPx;
  if (range <= 0) return 0;
  return Math.round(((widthPx - widthMinPx) / range) * 100);
};

const _ResizableSplitHandle = ({
  handleWidth,
  step,
  widthPx,
  widthMinPx,
  widthMaxPx,
  ariaValueNow,
  ariaValueMin,
  ariaValueMax,
  ariaValueText,
  accessibilityLabel,
  onChange,
  onVisualWidthChange,
  onChangeEnd,
  onDragCommit,
  onReset,
  getContainerRightEdge,
}: ResizableSplitHandleProps): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [dragPresentation, setDragPresentation] = useState<{
    widthPx: number;
    ariaValueNow: number;
    ariaValueText: string;
  } | null>(null);

  const latestWidthRef = useRef(widthPx);
  latestWidthRef.current = widthPx;

  const rafIdRef = useRef<number | null>(null);
  const pendingWidthRef = useRef<number | null>(null);

  const clampWidth = useCallback(
    (value: number): number => clamp(value, widthMinPx, widthMaxPx),
    [widthMinPx, widthMaxPx],
  );

  const cancelScheduledVisualUpdate = useCallback((): void => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingWidthRef.current = null;
  }, []);

  const flushVisualUpdate = useCallback((): void => {
    const pending = pendingWidthRef.current;
    rafIdRef.current = null;
    pendingWidthRef.current = null;
    if (pending === null) return;

    const clamped = clampWidth(pending);
    latestWidthRef.current = clamped;
    onVisualWidthChange(clamped);
    setDragPresentation({
      widthPx: clamped,
      ariaValueNow: toAriaValueNow(clamped, widthMinPx, widthMaxPx),
      ariaValueText: `${Math.round(clamped)}px`,
    });
  }, [clampWidth, onVisualWidthChange, widthMaxPx, widthMinPx]);

  const scheduleVisualUpdate = useCallback(
    (rawWidth: number): void => {
      pendingWidthRef.current = rawWidth;
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(flushVisualUpdate);
    },
    [flushVisualUpdate],
  );

  useEffect(() => {
    return () => {
      cancelScheduledVisualUpdate();
    };
  }, [cancelScheduledVisualUpdate]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.button != null && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    setDragPresentation(null);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.buttons === 0 || !isDraggingRef.current) return;
    const newWidth = getContainerRightEdge() - e.clientX;
    scheduleVisualUpdate(newWidth);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDraggingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragPresentation(null);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    if (pendingWidthRef.current !== null) {
      const clamped = clampWidth(pendingWidthRef.current);
      latestWidthRef.current = clamped;
      onVisualWidthChange(clamped);
    }
    cancelScheduledVisualUpdate();
    onDragCommit(latestWidthRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = widthPx - step;
      onChange(next);
      onChangeEnd(next);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = widthPx + step;
      onChange(next);
      onChangeEnd(next);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(widthMaxPx);
      onChangeEnd(widthMaxPx);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(widthMinPx);
      onChangeEnd(widthMinPx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onReset();
    }
  };

  const presentedAriaValueNow = dragPresentation?.ariaValueNow ?? ariaValueNow;
  const presentedAriaValueText = dragPresentation?.ariaValueText ?? ariaValueText;

  return (
    <StyledHandleContainer
      {...metaAttribute({ name: MetaConstants.ResizableSplitHandle })}
      $handleWidth={handleWidth}
      $isFocusVisible={isFocusVisible}
      role="separator"
      tabIndex={0}
      aria-label={accessibilityLabel}
      aria-orientation="horizontal"
      aria-valuenow={presentedAriaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuetext={presentedAriaValueText}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={handleKeyDown}
      onFocus={(e) => setIsFocusVisible(e.currentTarget.matches(':focus-visible'))}
      onBlur={() => setIsFocusVisible(false)}
    >
      <StyledTrack $isDragging={isDragging} />
      <StyledGrip $isDragging={isDragging}>
        <DragHandleIcon
          size="small"
          color={isDragging ? 'interactive.icon.onPrimary.normal' : undefined}
        />
      </StyledGrip>
    </StyledHandleContainer>
  );
};

const ResizableSplitHandle = memo(
  assignWithoutSideEffects(_ResizableSplitHandle, {
    displayName: 'ResizableSplitHandle',
    componentId: ComponentIds.ResizableSplitHandle,
  }),
);

export { ResizableSplitHandle };
