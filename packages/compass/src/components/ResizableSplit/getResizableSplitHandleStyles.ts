import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/CompassProvider';
import { makeSize, makeSpace, castWebType, makeMotionTime } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import type { ResizableSplitOrientation } from './types';
import type { HandleSizeConfig } from './handleSizeTokens';

const getHandleContainerStyles = ({
  theme,
  handleTrackSize,
  orientation,
  isFocusVisible,
}: {
  theme: Theme;
  handleTrackSize: number;
  orientation: ResizableSplitOrientation;
  isFocusVisible: boolean;
}): CSSObject => {
  const isHorizontal = orientation === 'horizontal';

  return {
    position: 'relative',
    flexShrink: 0,
    ...(isHorizontal
      ? { width: makeSize(handleTrackSize), height: '100%' }
      : { height: makeSize(handleTrackSize), width: '100%' }),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isHorizontal ? 'col-resize' : 'row-resize',
    touchAction: 'none',
    userSelect: 'none',
    outline: 'none',
    ...(isFocusVisible ? getFocusRingStyles({ theme }) : undefined),
  };
};

const getHandleTrackStyles = ({
  theme,
  isDragging,
  orientation,
}: {
  theme: Theme;
  isDragging: boolean;
  orientation: ResizableSplitOrientation;
}): CSSObject => {
  const isHorizontal = orientation === 'horizontal';

  return {
    position: 'absolute',
    ...(isHorizontal
      ? {
          insetBlock: 0,
          left: '50%',
          width: isDragging ? '2px' : '1px',
          transform: 'translateX(-50%)',
        }
      : {
          insetInline: 0,
          top: '50%',
          height: isDragging ? '2px' : '1px',
          transform: 'translateY(-50%)',
        }),
    backgroundColor: isDragging
      ? theme.colors.interactive.background.primary.default
      : theme.colors.interactive.background.gray.faded,
    transitionProperty: isHorizontal ? 'width, background-color' : 'height, background-color',
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
    transitionTimingFunction: castWebType(theme.motion.easing.standard),
  };
};

const getHandleGripStyles = ({
  theme,
  isDragging,
  grip,
}: {
  theme: Theme;
  isDragging: boolean;
  grip: Pick<HandleSizeConfig, 'gripWidth' | 'gripHeight'>;
}): CSSObject => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: makeSize(grip.gripWidth),
  height: makeSize(grip.gripHeight),
  borderRadius: makeSpace(theme.border.radius.xsmall),
  borderWidth: makeSize(theme.border.width.thin),
  borderStyle: 'solid',
  borderColor: isDragging ? theme.colors.interactive.border.primary.default : 'transparent',
  backgroundColor: isDragging
    ? theme.colors.interactive.background.primary.default
    : theme.colors.interactive.background.gray.faded,
  transitionProperty: 'background-color, border-color',
  transitionDuration: castWebType(makeMotionTime(theme.motion.duration.quick)),
  transitionTimingFunction: castWebType(theme.motion.easing.standard),
});

export { getHandleContainerStyles, getHandleTrackStyles, getHandleGripStyles };
