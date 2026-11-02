import React from 'react';
import styled from 'styled-components';
import { classes, getNavItemTransition, NAV_ITEM_HEIGHT } from '../tokens';
import type { SideNavItemProps } from '../types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';
import type { IconComponent } from '~components/Icons';
import { isIconComponent } from '~utils/isIconComponent';

const SideNavItemContainer = styled(BaseBox)((props) => {
  const { colors, spacing, border } = props.theme;
  return {
    transition: getNavItemTransition(props.theme),
    borderRadius: makeBorderSize(border.radius.small),
    margin: `${makeSpace(spacing[1])} ${makeSpace(spacing[0])}`,
    '&:hover': {
      backgroundColor: colors.interactive.background.primary.faded,
    },
  };
});

const SideNavItem = ({
  leading,
  trailing,
  title,
  backgroundColor,
  tooltip,
  as = 'div',
  ...rest
}: SideNavItemProps): React.ReactElement => {
  const isIcon = typeof leading === 'function' && isIconComponent(leading);
  const Icon: IconComponent | undefined = isIcon ? leading : undefined;

  return (
    <TooltipifyComponent tooltip={tooltip}>
      <SideNavItemContainer
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingX="spacing.3"
        paddingY="spacing.0"
        height={makeSize(NAV_ITEM_HEIGHT)}
        backgroundColor={backgroundColor}
        borderRadius="small"
        as={as}
        cursor={as === 'label' ? 'pointer' : undefined}
        {...makeAnalyticsAttribute(rest)}
      >
        <Box display="inline-flex" alignItems="center" gap="spacing.2">
          {Icon ? (
            <BaseBox display="flex" alignItems="center">
              <Icon size="large" color="interactive.icon.gray.subtle" />
            </BaseBox>
          ) : (
            (leading as React.ReactNode)
          )}
          <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>
            <Text
              truncateAfterLines={1}
              weight="regular"
              size="medium"
              color="surface.text.gray.subtle"
            >
              {title}
            </Text>
          </BaseBox>
        </Box>
        <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>{trailing}</BaseBox>
      </SideNavItemContainer>
    </TooltipifyComponent>
  );
};

export { SideNavItem };
