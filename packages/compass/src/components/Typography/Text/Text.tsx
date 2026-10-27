/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { ReactElement } from 'react';
import React from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { CompassElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwCompassError } from '~utils/logger';

import type { TextProps, TextVariant } from './types';
import { validAsValues } from './types';
export type { TextProps, TextVariant } from './types';

type GetTextPropsReturn = Omit<BaseTextProps, 'children'>;
type GetTextProps<T extends { variant: TextVariant }> = Pick<
  TextProps<T>,
  | 'variant'
  | 'weight'
  | 'size'
  | 'color'
  | 'testID'
  | 'textAlign'
  | 'textDecorationLine'
  | 'textTransform'
>;

const getTextProps = <T extends { variant: TextVariant }>({
  variant,
  weight,
  size,
  color = 'surface.text.gray.normal',
  testID,
  textAlign,
  textDecorationLine,
}: GetTextProps<T>): GetTextPropsReturn => {
  const props: GetTextPropsReturn = {
    color,
    fontSize: 100,
    fontWeight: weight ?? 'regular',
    fontStyle: 'normal',
    lineHeight: 100,
    fontFamily: 'text',
    componentName: 'text',
    testID,
    textAlign,
    textDecorationLine,
  };

  if (variant === 'caption') {
    // variant of caption can only have size of small
    if (size && size !== 'small' && size !== 'medium') {
      if (__DEV__) {
        throwCompassError({
          moduleName: 'Text',
          message: `size cannot be '${size}' when variant is 'caption'`,
        });
      }
      // Set size as small in case of invalid size
      size = 'small';
    }
  } else if (variant !== 'caption' && !size) {
    size = 'medium';
  }

  if (variant === 'body') {
    if (size === 'xsmall') {
      props.fontSize = 25;
      props.lineHeight = 25;
      props.letterSpacing = 50;
    }
    if (size === 'small') {
      props.fontSize = 75;
      props.lineHeight = 75;
      props.letterSpacing = 50;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 100;
      props.letterSpacing = 50;
    }
    if (size === 'large') {
      props.fontSize = 200;
      props.lineHeight = 200;
      props.letterSpacing = 25;
    }
  }
  if (variant === 'caption') {
    if (size === 'small') {
      props.fontSize = 50;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
      props.letterSpacing = 50;
    }
    if (size === 'medium') {
      props.fontSize = 100;
      props.lineHeight = 50;
      props.fontWeight = 'regular';
      props.letterSpacing = 50;
    }
  }

  return props;
};

const _Text = <T extends { variant: TextVariant }>(
  {
    as = 'p',
    variant = 'body',
    weight = 'regular',
    size,
    truncateAfterLines,
    children,
    color,
    testID,
    textAlign,
    textDecorationLine,
    wordBreak,
    textTransform,
    elementtiming,
    ...styledProps
  }: TextProps<T>,
  ref: React.Ref<CompassElementRef>,
): ReactElement => {
  const props: Omit<BaseTextProps, 'children'> = {
    as,
    truncateAfterLines,
    wordBreak,
    textTransform,
    elementtiming,
    ...getTextProps({
      variant,
      weight,
      color,
      size,
      testID,
      textAlign,
      textDecorationLine,
    }),
  };

  useValidateAsProp({ componentName: 'Text', as, validAsValues });

  return (
    <BaseText ref={ref} {...props} {...getStyledProps(styledProps)}>
      {children}
    </BaseText>
  );
};

const Text = assignWithoutSideEffects(React.forwardRef(_Text), {
  displayName: 'Text',
  componentId: 'Text',
});

export { Text, getTextProps };
