import type { BaseMotionEntryExitProps } from '~components/BaseMotion';
import type { BoxProps } from '~components/Box';

/** Staggers enter/exit motion across multiple children. */
type StaggerProps = Pick<
  BaseMotionEntryExitProps,
  'isVisible' | 'motionTriggers' | 'shouldUnmountWhenHidden' | 'type' | 'delay'
> & {
  /** One or more motion children to stagger. */
  children: React.ReactElement[] | React.ReactElement;
} & Omit<BoxProps, 'as'>;

export type { StaggerProps };
