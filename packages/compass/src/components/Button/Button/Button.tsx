import React from 'react';
import BaseButton from '../BaseButton';
import { getStyledProps } from '~components/Box/styledProps';
import type { CompassElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { ButtonProps } from './types';
export type { ButtonProps } from './types';

const _Button: React.ForwardRefRenderFunction<CompassElementRef, ButtonProps> = (
  // While adding any prop here, make sure to handle it in DropdownButton as well
  {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    href,
    target,
    rel,
    onClick,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    color = 'primary',
    accessibilityLabel,
    role,
    testID,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  },
  ref,
) => {
  return (
    <BaseButton
      {...(icon ? { icon, children } : { children })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      accessibilityProps={{
        label: accessibilityLabel,
        describedBy: rest['aria-describedby'],
        expanded: rest['aria-expanded'],
        hasPopup: rest['aria-haspopup'],
        role,
      }}
      iconPosition={iconPosition}
      color={color}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
      isLoading={isLoading}
      testID={testID}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
  );
};

const Button = assignWithoutSideEffects(React.forwardRef(_Button), {
  displayName: 'Button',
  componentId: 'Button',
});

export default Button;
