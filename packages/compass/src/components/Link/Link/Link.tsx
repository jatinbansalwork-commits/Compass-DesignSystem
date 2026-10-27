import type { ReactElement } from 'react';
import React from 'react';
import { BaseLink } from '../BaseLink';
import { getStyledProps } from '~components/Box/styledProps';
import type { CompassElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { LinkProps } from './types';
export type { LinkButtonVariantProps, LinkProps } from './types';

const _Link: React.ForwardRefRenderFunction<CompassElementRef, LinkProps> = (
  {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    onClick,
    variant = 'anchor',
    color = 'primary',
    href,
    target,
    rel,
    accessibilityLabel,
    size = 'medium',
    testID,
    hitSlop,
    htmlTitle,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    onMouseDown,
    onMouseUp,
    ...rest
  },
  ref,
): ReactElement => {
  return (
    <BaseLink
      {...(icon ? { icon, children } : { children })}
      {...(variant === 'anchor' ? { variant, href, target, rel } : { variant, isDisabled })}
      ref={ref as never}
      iconPosition={iconPosition}
      onClick={onClick}
      accessibilityProps={{ label: accessibilityLabel, describedBy: rest['aria-describedby'] }}
      size={size}
      color={color}
      testID={testID}
      hitSlop={hitSlop}
      htmlTitle={htmlTitle}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    />
  );
};

const Link = assignWithoutSideEffects(React.forwardRef(_Link), {
  displayName: 'Link',
  componentId: 'Link',
});

export default Link;
