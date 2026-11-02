import type { IconSize } from '~components/Icons/types';

type ResizableSplitHandleSize = 'small' | 'medium' | 'large';

type HandleSizeConfig = {
  trackSize: number;
  gripWidth: number;
  gripHeight: number;
  iconSize: IconSize;
};

const HANDLE_SIZE_CONFIG: Record<ResizableSplitHandleSize, HandleSizeConfig> = {
  small: {
    trackSize: 8,
    gripWidth: 16,
    gripHeight: 24,
    iconSize: 'xsmall',
  },
  medium: {
    trackSize: 12,
    gripWidth: 20,
    gripHeight: 32,
    iconSize: 'small',
  },
  large: {
    trackSize: 20,
    gripWidth: 28,
    gripHeight: 44,
    iconSize: 'medium',
  },
};

const resolveHandleTrackSize = (
  handleSize: ResizableSplitHandleSize,
  handleWidth?: number,
): number => handleWidth ?? HANDLE_SIZE_CONFIG[handleSize].trackSize;

export { HANDLE_SIZE_CONFIG, resolveHandleTrackSize };
export type { ResizableSplitHandleSize, HandleSizeConfig };
