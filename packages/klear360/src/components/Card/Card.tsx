/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard } from './CardContext';
import { LinkOverlay } from './LinkOverlay';
import { CardRoot } from './CardRoot';
import type { LinkOverlayProps } from './types';
import { CARD_LINK_OVERLAY_ID } from './constants';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, Klear360ElementRef, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BoxProps } from '~components/Box';
import { makeAccessible } from '~utils/makeAccessible';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren/useVerifyAllowedChildren';
import { isReactNative, useTheme } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useCheckboxGroupContext } from '~components/Checkbox/CheckboxGroup/CheckboxGroupContext';
import { useRadioGroupContext } from '~components/Radio/RadioGroup/RadioContext';
import type { CheckboxGroupContextType } from '~components/Checkbox/CheckboxGroup/CheckboxGroupContext';
import type { RadioGroupContextType } from '~components/Radio/RadioGroup/RadioContext';

export const ComponentIds = {
  CardHeader: 'CardHeader',
  CardHeaderTrailing: 'CardHeaderTrailing',
  CardHeaderLeading: 'CardHeaderLeading',
  CardFooter: 'CardFooter',
  CardFooterTrailing: 'CardFooterTrailing',
  CardFooterLeading: 'CardFooterLeading',
  CardBody: 'CardBody',
  CardHeaderIcon: 'CardHeaderIcon',
  CardHeaderCounter: 'CardHeaderCounter',
  CardHeaderBadge: 'CardHeaderBadge',
  CardHeaderAmount: 'CardHeaderAmount',
  CardHeaderText: 'CardHeaderText',
  CardHeaderLink: 'CardHeaderLink',
  CardHeaderIconButton: 'CardHeaderIconButton',
};

import type { CardProps } from './cardProps.types';

const _Card: React.ForwardRefRenderFunction<Klear360ElementRef, CardProps> = (
  {
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    backgroundColor,
    borderRadius = 'medium',
    elevation = 'lowRaised',
    testID,
    padding = 'spacing.7',
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    onClick,
    isSelected = false,
    isDisabled = false,
    accessibilityLabel,
    shouldScaleOnHover = false,
    onHover,
    href,
    target,
    rel,
    as,
    variant = 'primary',
    size = 'large',
    cursor,
    opacity,
    transition,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    ...rest
  },
  ref,
): React.ReactElement => {
  const [isFocused, setIsFocused] = React.useState(false);
  const { colorScheme } = useTheme();

  useVerifyAllowedChildren({
    children,
    componentName: 'Card',
    allowedComponents:
      variant === 'secondary'
        ? [ComponentIds.CardBody]
        : [ComponentIds.CardHeader, ComponentIds.CardBody, ComponentIds.CardFooter],
  });

  const checkboxGroupProps = useCheckboxGroupContext();
  const radioGroupProps = useRadioGroupContext();

  const getGroupProps = (): CheckboxGroupContextType | RadioGroupContextType | undefined => {
    if (Object.keys(checkboxGroupProps).length > 0) return checkboxGroupProps;
    if (Object.keys(radioGroupProps).length > 0) return radioGroupProps;
    return undefined;
  };

  const groupProps = getGroupProps();
  const _validationState = groupProps?.validationState;

  // `isDisabled` takes precedence over `isSelected`. A Card used as a selection control inside a
  // disabled Checkbox/Radio group is disabled too.
  const isCardDisabled = isDisabled || Boolean(groupProps?.isDisabled);
  const isCardSelected = isSelected && !isCardDisabled;

  const linkOverlayProps: LinkOverlayProps = {
    ...metaAttribute({ name: CARD_LINK_OVERLAY_ID }),
    ...makeAccessible({ label: accessibilityLabel, pressed: href ? undefined : isCardSelected }),
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  };
  const defaultRel = target && target === '_blank' ? 'noreferrer noopener' : undefined;

  return (
    <CardProvider size={size}>
      <CardRoot
        as={as}
        ref={ref as never}
        display={'block' as never}
        borderRadius="medium"
        onMouseEnter={onHover as never}
        shouldScaleOnHover={shouldScaleOnHover}
        isSelected={isCardSelected}
        isFocused={isFocused}
        // on react native we need to pass onClick to root, because we don't need the LinkOverlay in RN
        onClick={isReactNative() && !isCardDisabled ? onClick : undefined}
        width={width}
        height={height}
        minHeight={minHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        href={isCardDisabled ? undefined : href}
        accessibilityLabel={accessibilityLabel}
        validationState={_validationState}
        cursor={(isReactNative() ? undefined : isCardDisabled ? 'not-allowed' : cursor) as never}
        opacity={opacity}
        transition={transition}
        flexShrink={flexShrink}
        {...makeAccessible({ disabled: isCardDisabled ? true : undefined })}
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <CardSurface
          height={height}
          minHeight={minHeight}
          padding={padding}
          borderRadius="medium"
          textAlign={'left' as never}
          backgroundColor="surface.background.gray.intense"
          colorScheme={colorScheme}
          isSelected={isCardSelected}
          elevation={elevation}
          overflow={overflow}
          overflowX={overflowX}
          overflowY={overflowY}
          variant={variant}
          $isCard={true}
        >
          {!isCardDisabled && href ? (
            <LinkOverlay
              onClick={onClick}
              href={href}
              target={target}
              rel={rel ?? defaultRel}
              {...linkOverlayProps}
            />
          ) : null}
          {!isCardDisabled && !href && onClick ? (
            <LinkOverlay as="button" onClick={onClick} {...linkOverlayProps} />
          ) : null}
          {children}
        </CardSurface>
      </CardRoot>
    </CardProvider>
  );
};

type CardBodyProps = {
  children: React.ReactNode;
  height?: BoxProps['height'];
} & TestID &
  DataAnalyticsAttribute;

const _CardBody = ({ height, children, testID, ...rest }: CardBodyProps): React.ReactElement => {
  useVerifyInsideCard('CardBody');

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.CardBody, testID })}
      {...makeAnalyticsAttribute(rest)}
      height={height}
    >
      {children}
    </BaseBox>
  );
};

const Card = React.forwardRef(_Card);
const CardBody = assignWithoutSideEffects(_CardBody, { componentId: ComponentIds.CardBody });

export type { CardProps } from './cardProps.types';
export { Card, CardBody };
