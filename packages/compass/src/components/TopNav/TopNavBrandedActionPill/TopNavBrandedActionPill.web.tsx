import React from 'react';
import styled from 'styled-components';
import type { TopNavBrandedActionPillProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { AnimatedKlearIcon, KlearIcon } from '~components/Icons';

const IconWrap = styled(BaseBox)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledPillButton = styled.button(({ theme }) => {
  const quick = makeMotionTime(theme.motion.duration.quick);
  const easing = theme.motion.easing.standard;

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: makeSpace(theme.spacing[2]),
    padding: `${makeSpace(theme.spacing[2])} ${makeSpace(theme.spacing[4])}`,
    borderRadius: makeBorderSize(theme.border.radius.max),
    border: `${makeBorderSize(theme.border.width.thin)} solid ${getIn(theme.colors, 'interactive.border.staticWhite.faded')}`,
    backgroundColor: getIn(theme.colors, 'interactive.background.staticWhite.faded'),
    color: getIn(theme.colors, 'interactive.text.staticWhite.normal'),
    cursor: 'pointer',
    outline: 'none',
    [`${IconWrap}`]: {
      transition: `transform ${quick} ${easing}`,
    },
    '&:hover': {
      backgroundColor: getIn(theme.colors, 'interactive.background.staticWhite.default'),
    },
    '&:focus-visible': {
      boxShadow: `0 0 0 ${makeBorderSize(theme.border.width.thick)} ${getIn(theme.colors, 'interactive.border.primary.default')}`,
    },
    '@media (prefers-reduced-motion: no-preference)': {
      '&:hover, &:focus-visible': {
        [`${IconWrap}`]: {
          transform: 'rotate(12deg)',
        },
      },
    },
  };
});

const _TopNavBrandedActionPill = ({
  icon: Icon,
  label,
  accessibilityLabel,
  onClick,
  testID,
}: TopNavBrandedActionPillProps): React.ReactElement => {
  const ResolvedIcon = Icon === KlearIcon ? AnimatedKlearIcon : Icon;

  return (
    <StyledPillButton
      type="button"
      aria-label={accessibilityLabel ?? label}
      onClick={onClick}
      {...metaAttribute({ name: MetaConstants.TopNavBrandedActionPill, testID })}
    >
      <IconWrap aria-hidden>
        <ResolvedIcon size="small" color="interactive.icon.staticWhite.normal" />
      </IconWrap>
      <Text size="small" weight="semibold" color="interactive.text.staticWhite.normal">
        {label}
      </Text>
    </StyledPillButton>
  );
};

const TopNavBrandedActionPill = assignWithoutSideEffects(_TopNavBrandedActionPill, {
  componentId: 'TopNavBrandedActionPill',
});

export { TopNavBrandedActionPill };
