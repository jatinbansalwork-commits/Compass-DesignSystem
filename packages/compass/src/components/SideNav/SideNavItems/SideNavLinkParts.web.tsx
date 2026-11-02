import styled from 'styled-components';
import { classes, getNavItemTransition, NAV_ITEM_HEIGHT } from '../tokens';
import type { SideNavLinkProps } from '../types';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { useTruncationTitle } from '~utils/useTruncationTitle';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';
import { Text } from '~components/Typography';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

const { SHOW_ON_LINK_HOVER, HIDE_WHEN_COLLAPSED, STYLED_NAV_LINK } = classes;

const StyledNavLinkContainer = styled(BaseBox)<{
  $hasDescription: boolean;
  $isL1Item?: boolean;
}>((props) => {
  const { spacing, colors, border } = props.theme;
  const verticalPad = props.$hasDescription
    ? spacing[3]
    : props.$isL1Item
      ? spacing[0]
      : spacing[2];
  const horizontalPad = spacing[3];

  return {
    width: '100%',
    [`.${SHOW_ON_LINK_HOVER}`]: {
      opacity: 0,
      '&:focus-within, &:focus-visible': {
        opacity: 1,
      },
    },
    '&:hover': {
      [`.${SHOW_ON_LINK_HOVER}`]: {
        opacity: 1,
      },

      [`.${STYLED_NAV_LINK}:not([aria-current])`]: {
        color: colors.interactive.text.gray.normal,
        backgroundColor: colors.interactive.background.primary.faded,
      },
    },
    [`.${STYLED_NAV_LINK}`]: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: props.$hasDescription ? undefined : makeSize(NAV_ITEM_HEIGHT),
      width: '100%',
      textDecoration: 'none',
      overflow: 'hidden',
      flexWrap: 'nowrap',
      cursor: 'pointer',
      padding: `${makeSpace(verticalPad)} ${makeSpace(horizontalPad)}`,
      margin: `${makeSpace(spacing[1])} ${makeSpace(spacing[0])}`,
      color: colors.interactive.text.gray.subtle,
      borderRadius: makeBorderSize(border.radius.small),
      borderWidth: makeBorderSize(border.width.none),
      backgroundColor: colors.transparent,
      transition: getNavItemTransition(props.theme),
      '&[aria-current], &[aria-current]:hover': {
        color: colors.surface.text.primary.normal,
        backgroundColor: colors.interactive.background.primary.fadedHighlighted,
      },
      '&:focus-visible': {
        ...getFocusRingStyles({ theme: props.theme }),
      },
    },
  };
});

const NavLinkIconTitle = ({
  icon: Icon,
  title,
  description,
  titleSuffix,
  isActive,
  trailing,
  isL1Item,
}: Pick<
  SideNavLinkProps,
  'title' | 'isActive' | 'trailing' | 'description' | 'icon' | 'titleSuffix'
> & {
  isL1Item: boolean;
}): React.ReactElement => {
  const { containerRef, textRef } = useTruncationTitle({ content: title });

  return (
    <Box width="100%" textAlign="left">
      <Box display="flex" justifyContent="space-between" width="100%">
        <Box
          display="flex"
          flexDirection="row"
          gap={isL1Item ? 'spacing.2' : 'spacing.3'}
          alignItems="center"
        >
          {Icon ? (
            <BaseBox display="flex" flexDirection="row" alignItems="center" flexShrink={0}>
              <Icon size={isL1Item ? 'large' : 'medium'} color="currentColor" />
            </BaseBox>
          ) : null}
          <Box ref={containerRef as never} flex="1" minWidth="spacing.0">
            <BaseText
              ref={textRef as never}
              truncateAfterLines={1}
              color="currentColor"
              fontWeight={isActive ? 'semibold' : 'regular'}
              fontSize={100}
              lineHeight={100}
              as="p"
              className={isL1Item ? HIDE_WHEN_COLLAPSED : ''}
            >
              {title}
            </BaseText>
          </Box>
          {titleSuffix ? (
            <BaseBox
              className={isL1Item ? HIDE_WHEN_COLLAPSED : undefined}
              display="flex"
              alignItems="center"
            >
              {titleSuffix}
            </BaseBox>
          ) : null}
        </Box>
        <Box display="flex" alignItems="center">
          {trailing}
        </Box>
      </Box>
      {!isL1Item && description ? (
        <Text
          size="small"
          marginLeft="spacing.7"
          textAlign="left"
          weight="medium"
          color={isActive ? 'interactive.text.gray.subtle' : 'interactive.text.gray.muted'}
          truncateAfterLines={1}
        >
          {description}
        </Text>
      ) : null}
    </Box>
  );
};

export { StyledNavLinkContainer, NavLinkIconTitle, SHOW_ON_LINK_HOVER, HIDE_WHEN_COLLAPSED, STYLED_NAV_LINK };
