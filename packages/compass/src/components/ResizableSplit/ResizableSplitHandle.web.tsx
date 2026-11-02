import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  getHandleContainerStyles,
  getHandleTrackStyles,
  getHandleGripStyles,
} from './getResizableSplitHandleStyles';
import type { HandleSizeConfig } from './handleSizeTokens';
import type { ResizableSplitOrientation } from './types';
import { ComponentIds } from './componentIds';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import DragHandleIcon from '~components/Icons/DragHandleIcon';
import clamp from '~utils/lodashButBetter/clamp';

const StyledHandleContainer = styled.div<{
  $handleTrackSize: number;
  $orientation: ResizableSplitOrientation;
  $isFocusVisible: boolean;
}>(({ theme, $handleTrackSize, $orientation, $isFocusVisible }) =>
  getHandleContainerStyles({
    theme,
    handleTrackSize: $handleTrackSize,
    orientation: $orientation,
    isFocusVisible: $isFocusVisible,
  }),
);

const StyledTrack = styled.div<{
  $isDragging: boolean;
  $orientation: ResizableSplitOrientation;
}>(({ theme, $isDragging, $orientation }) =>
  getHandleTrackStyles({ theme, isDragging: $isDragging, orientation: $orientation }),
);

const StyledGrip = styled.div<{
  $isDragging: boolean;
  $orientation: ResizableSplitOrientation;
  $grip: Pick<HandleSizeConfig, 'gripWidth' | 'gripHeight'>;
}>(({ theme, $isDragging, $orientation, $grip }) => ({
  ...getHandleGripStyles({ theme, isDragging: $isDragging, grip: $grip }),
  ...( $orientation === 'vertical' ? { transform: 'rotate(90deg)' } : undefined),
}));

type ResizableSplitHandleProps = {
  orientation: ResizableSplitOrientation;
  handleTrackSize: number;
  gripConfig: HandleSizeConfig;
  step: number;
  endSizePx: number;
  endSizeMinPx: number;
  endSizeMaxPx: number;
  ariaValueNow: number;
  ariaValueMin: number;
  ariaValueMax: number;
  ariaValueText: string;
  accessibilityLabel: string;
  onChange: (size: number) => void;
  onVisualEndSizeChange: (size: number) => void;
  onChangeEnd: (size: number) => void;
  onDragCommit: (size: number) => void;
  onReset: () => void;
  getEndSizeFromPointer: (clientX: number, clientY: number) => number;
};

const toAriaValueNow = (sizePx: number, minPx: number, maxPx: number): number => {
  const range = maxPx - minPx;
  if (range <= 0) return 0;
  return Math.round(((sizePx - minPx) / range) * 100);
};

const _ResizableSplitHandle = ({
  orientation,
  handleTrackSize,
  gripConfig,
  step,
  endSizePx,
  endSizeMinPx,
  endSizeMaxPx,
  ariaValueNow,
  ariaValueMin,
  ariaValueMax,
  ariaValueText,
  accessibilityLabel,
  onChange,
  onVisualEndSizeChange,
  onChangeEnd,
  onDragCommit,
  onReset,
  getEndSizeFromPointer,
}: ResizableSplitHandleProps): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [dragPresentation, setDragPresentation] = useState<{
    ariaValueNow: number;
    ariaValueText: string;
  } | null>(null);

  const latestSizeRef = useRef(endSizePx);
  latestSizeRef.current = endSizePx;

  const rafIdRef = useRef<number | null>(null);
  const pendingSizeRef = useRef<number | null>(null);

  const clampSize = useCallback(
    (value: number): number => clamp(value, endSizeMinPx, endSizeMaxPx),
    [endSizeMinPx, endSizeMaxPx],
  );

  const cancelScheduledVisualUpdate = useCallback((): void => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    pendingSizeRef.current = null;
  }, []);

  const flushVisualUpdate = useCallback((): void => {
    const pending = pendingSizeRef.current;
    rafIdRef.current = null;
    pendingSizeRef.current = null;
    if (pending === null) return;

    const clamped = clampSize(pending);
    latestSizeRef.current = clamped;
    onVisualEndSizeChange(clamped);
    const unit = orientation === 'vertical' ? 'tall' : 'wide';
    setDragPresentation({
      ariaValueNow: toAriaValueNow(clamped, endSizeMinPx, endSizeMaxPx),
      ariaValueText: `${Math.round(clamped)}px ${unit}`,
    });
  }, [clampSize, endSizeMaxPx, endSizeMinPx, onVisualEndSizeChange, orientation]);

  const scheduleVisualUpdate = useCallback(
    (rawSize: number): void => {
      pendingSizeRef.current = rawSize;
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

  const dragCursor = orientation === 'horizontal' ? 'col-resize' : 'row-resize';

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.button != null && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    setDragPresentation(null);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = dragCursor;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.buttons === 0 || !isDraggingRef.current) return;
    scheduleVisualUpdate(getEndSizeFromPointer(e.clientX, e.clientY));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDraggingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    setIsDragging(false);
    setDragPresentation(null);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    if (pendingSizeRef.current !== null) {
      const clamped = clampSize(pendingSizeRef.current);
      latestSizeRef.current = clamped;
      onVisualEndSizeChange(clamped);
    }
    cancelScheduledVisualUpdate();
    onDragCommit(latestSizeRef.current);
  };

  const nudgeEndSize = (delta: number): void => {
    const next = endSizePx + delta;
    onChange(next);
    onChangeEnd(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const decreaseKeys =
      orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];
    const increaseKeys =
      orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];

    if (decreaseKeys.includes(e.key)) {
      e.preventDefault();
      nudgeEndSize(-step);
    } else if (increaseKeys.includes(e.key)) {
      e.preventDefault();
      nudgeEndSize(step);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(endSizeMaxPx);
      onChangeEnd(endSizeMaxPx);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(endSizeMinPx);
      onChangeEnd(endSizeMinPx);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      onReset();
    }
  };

  const presentedAriaValueNow = dragPresentation?.ariaValueNow ?? ariaValueNow;
  const presentedAriaValueText = dragPresentation?.ariaValueText ?? ariaValueText;
  const ariaOrientation = orientation === 'horizontal' ? 'horizontal' : 'vertical';

  return (
    <StyledHandleContainer
      {...metaAttribute({ name: MetaConstants.ResizableSplitHandle })}
      $handleTrackSize={handleTrackSize}
      $orientation={orientation}
      $isFocusVisible={isFocusVisible}
      role="separator"
      tabIndex={0}
      aria-label={accessibilityLabel}
      aria-orientation={ariaOrientation}
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
      onFocus={(ev) => setIsFocusVisible(ev.currentTarget.matches(':focus-visible'))}
      onBlur={() => setIsFocusVisible(false)}
    >
      <StyledTrack $isDragging={isDragging} $orientation={orientation} />
      <StyledGrip $isDragging={isDragging} $orientation={orientation} $grip={gripConfig}>
        <DragHandleIcon
          size={gripConfig.iconSize}
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
