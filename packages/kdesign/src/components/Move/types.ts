import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

/** Motion preset: animates position and opacity for enter/exit. */
type MoveProps = Pick<
  BaseMotionEntryExitProps,
  'children' | 'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
>;

export type { MoveProps };
