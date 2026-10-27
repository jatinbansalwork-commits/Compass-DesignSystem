/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import type { ReactElement } from 'react';
import { BaseText } from '../BaseText';
import type { BaseTextProps } from '../BaseText/types';
import { useValidateAsProp } from '../utils';
import { getStyledProps } from '~components/Box/styledProps';
import { isReactNative } from '~utils';
import type { CompassElementRef } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { HeadingProps } from './types';
import { validHeadingAsValues } from './types';
export type { HeadingProps } from './types';

export const getHeadingProps = ({
  as,
  size,
  weight,
  color,
  testID,
}: Pick<HeadingProps, 'as' | 'size' | 'weight' | 'color' | 'testID'>): Omit<
  BaseTextProps,
  'children'
> => {
  const props: Omit<BaseTextProps, 'children'> = {
    color,
    fontSize: 300,
    fontWeight: weight ?? 'semibold',
    fontStyle: 'normal',
    lineHeight: 300,
    fontFamily: 'heading',
    accessibilityProps: isReactNative() ? { role: 'heading' } : {},
    componentName: 'heading',
    testID,
  };

  if (size === 'small') {
    props.fontSize = 300;
    props.lineHeight = 300;
    props.as = 'h6';
  } else if (size === 'medium') {
    props.fontSize = 400;
    props.lineHeight = 400;
    props.as = 'h5';
  } else if (size === 'large') {
    props.fontSize = 500;
    props.lineHeight = 500;
    props.as = 'h4';
  } else if (size === 'xlarge') {
    props.fontSize = 600;
    props.lineHeight = 600;
    props.as = 'h3';
  } else if (size === '2xlarge') {
    props.fontSize = 700;
    props.lineHeight = 700;
    props.as = 'h2';
  }

  // override the computed `as` prop if user passed an `as` prop
  props.as = as || props.as;
  return props;
};

const _Heading = (
  {
    as,
    size = 'small',
    weight = 'semibold',
    color = 'surface.text.gray.normal',
    children,
    testID,
    textAlign,
    textDecorationLine,
    wordBreak,
    textTransform,
    ...styledProps
  }: HeadingProps,
  ref: React.Ref<CompassElementRef>,
): ReactElement => {
  useValidateAsProp({ componentName: 'Heading', as, validAsValues: validHeadingAsValues });

  const props = getHeadingProps({ as, size, weight, color, testID });

  return (
    <BaseText
      {...props}
      ref={ref}
      textAlign={textAlign}
      textDecorationLine={textDecorationLine}
      textTransform={textTransform}
      wordBreak={wordBreak}
      {...getStyledProps(styledProps)}
      {...makeAnalyticsAttribute(styledProps)}
    >
      {children}
    </BaseText>
  );
};

const Heading = React.forwardRef(_Heading);

export { Heading };
