import React, { useRef, useState } from 'react';
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
  onChangeEnd: (width: number) => void;
  onReset: () => void;
  getContainerRightEdge: () => number;
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
  onChangeEnd,
  onReset,
  getContainerRightEdge,
}: ResizableSplitHandleProps): React.ReactElement => {
  const [isDragging, setIsDragging] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const latestWidthRef = useRef(widthPx);
  latestWidthRef.current = widthPx;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (e.buttons === 0) return;
    const newWidth = getContainerRightEdge() - e.clientX;
    onChange(newWidth);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>): void => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    onChangeEnd(latestWidthRef.current);
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

  return (
    <StyledHandleContainer
      {...metaAttribute({ name: MetaConstants.ResizableSplitHandle })}
      $handleWidth={handleWidth}
      $isFocusVisible={isFocusVisible}
      role="separator"
      tabIndex={0}
      aria-label={accessibilityLabel}
      aria-orientation="horizontal"
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-valuetext={ariaValueText}
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

const ResizableSplitHandle = assignWithoutSideEffects(_ResizableSplitHandle, {
  displayName: 'ResizableSplitHandle',
  componentId: ComponentIds.ResizableSplitHandle,
});

export { ResizableSplitHandle };
