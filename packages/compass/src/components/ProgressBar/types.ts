import type { ProgressBarProps } from './ProgressBar';
import type { DelayString, DurationString, EasingString } from '~tokens/global';

/** Internal props for the linear filled bar segment (not the public ProgressBar API). */
type ProgressBarFilledProps = {
  /** Track/fill background token resolved to CSS color. */
  backgroundColor: string;
  /** Progress ratio 0–1 for determinate bars. */
  progress: number;
  /** Duration token for fill width animation. */
  fillMotionDuration: DurationString;
  /** Duration token for pulse animation. */
  pulseMotionDuration: DurationString;
  /** Duration token for indeterminate sweep. */
  indeterminateMotionDuration: DurationString;
  /** Delay before pulse loop. */
  pulseMotionDelay: DelayString;
  /** Easing token for motion. */
  motionEasing: EasingString;
  /** Bar variant from public ProgressBar props. */
  type: ProgressBarProps['type'];
  /** Indeterminate loading mode. */
  isIndeterminate: boolean;
  /** Internal oscillation flag for indeterminate motion. */
  _oscillation?: boolean;
};

type CircularProgressBarFilledProps = Pick<
  ProgressBarProps,
  'size' | 'label' | 'showPercentage' | 'type'
> & {
  isMeter: boolean;
  backgroundColor: string;
  fillColor: string;
  progressPercent: number;
  pulseMotionDuration: DurationString;
  fillMotionDuration: DurationString;
  pulseMotionDelay: DelayString;
  motionEasing: EasingString;
};

export type { ProgressBarFilledProps, CircularProgressBarFilledProps };
