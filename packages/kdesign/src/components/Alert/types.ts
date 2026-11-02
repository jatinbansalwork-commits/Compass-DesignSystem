import type { ReactNode } from 'react';

import type { FeedbackColors, SubtleOrIntense } from '~tokens/theme/theme';
import type { StyledPropsKdesign } from '~components/Box/styledProps';

export type AlertColors = FeedbackColors | 'primary';

export type StyledAlertProps = {
  /** Alert content (title, body, actions). */
  children: ReactNode;
  /** Subtle vs intense surface treatment. */
  emphasis: SubtleOrIntense;
  /** Feedback or primary color family for the alert. */
  color: AlertColors;
  /** When true, spans the full width of the container. */
  isFullWidth: boolean;
  /** Layout tweaks for desktop breakpoints. */
  isDesktop: boolean;
} & StyledPropsKdesign;
