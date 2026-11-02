import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Svg, Path } from '../_Svg';
import type { IconComponent, IconProps } from '../types';
import useIconProps from '../hooks/useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const KLEAR_ICON_PATH =
  'M3 3H7.5H9.74999L12 12L14.25 3H16.5H21V7.5V9.75L12 12L21 14.25V16.5V21H16.5H14.25L12 12L9.74999 21H7.5H3V16.5V14.25L12 12L3 9.75V7.5V3Z';

/** Matches Klearsense `KlearRotate`: 0.7s rotate + 1.1s hold (1.8s cycle). */
const klearIconRotateKeyframe = keyframes`
  0% {
    transform: rotate(0deg);
  }
  38.89% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(90deg);
  }
`;

const animatedIconGroupStyles = css`
  transform-box: fill-box;
  transform-origin: center;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${klearIconRotateKeyframe} 1.8s ease-in-out infinite;
  }
`;

const AnimatedIconGroup = styled.g`
  ${animatedIconGroupStyles}
`;

type KlearIconProps = IconProps & {
  /** Looped 90° rotation used for Klear Agent affordances. */
  isAnimated?: boolean;
};

const _KlearIcon = ({
  size,
  color,
  isAnimated = false,
  ...styledProps
}: KlearIconProps): React.ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });
  const path = <Path d={KLEAR_ICON_PATH} fill={iconColor} />;
  const iconGraphic = isAnimated ? <AnimatedIconGroup>{path}</AnimatedIconGroup> : path;

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      {iconGraphic}
    </Svg>
  );
};

const KlearIcon = assignWithoutSideEffects(_KlearIcon, {
  componentId: 'KlearIcon',
});

const AnimatedKlearIcon: IconComponent = (props) => <KlearIcon {...props} isAnimated />;

export default KlearIcon;
export type { KlearIconProps };
export { AnimatedKlearIcon };
