import type { Dispatch, SetStateAction } from 'react';
import type { CSSObject } from 'styled-components';
import type { BaseLinkProps } from './BaseLink';
import type { DurationString, EasingString } from '~tokens/global';
import type { StyledPropsCompass } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';
import type { CompassCommonEvents } from '~components/types';
import type { ActionStates } from '~utils/useInteraction';

/** Internal styled-props for BaseLink (not the public Link API). */
export type StyledBaseLinkProps = {
  /** Link visual variant from public Link props. */
  variant: BaseLinkProps['variant'];
  /** Rendered element: anchor or button. */
  as: 'a' | 'button';
  /** CSS cursor override. */
  cursor?: CSSObject['cursor'];
  /** Navigation URL when rendered as anchor. */
  href?: string;
  /** Anchor target attribute. */
  target?: string;
  /** Anchor rel attribute. */
  rel?: string;
  onClick?: BaseLinkProps['onClick'];
  onBlur?: BaseLinkProps['onBlur'];
  onMouseLeave?: BaseLinkProps['onMouseLeave'];
  onKeyDown?: BaseLinkProps['onKeyDown'];
  focusRingColor: string;
  disabled: boolean;
  motionDuration: DurationString;
  motionEasing: EasingString;
  setCurrentInteraction: Dispatch<SetStateAction<ActionStates>>;
  accessibilityProps: Record<string, unknown>;
  type?: 'button';
  size?: 'small' | 'medium';
  hitSlop?: BaseLinkProps['hitSlop'];
} & TestID &
  StyledPropsCompass &
  Omit<CompassCommonEvents, 'onBlur' | 'onMouseLeave'>;
