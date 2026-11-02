import type { BaseMotionEntryExitProps } from '~components/BaseMotion';

/** Motion preset: animates opacity for enter/exit. Props mirror selected `BaseMotionEntryExitProps` fields. */
export type FadeProps = Pick<
  BaseMotionEntryExitProps,
  'children' | 'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
>;
