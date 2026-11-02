import React from 'react';
import styled from 'styled-components';
import { useSideNav } from '../SideNavContext';
import {
  classes,
  COLLAPSED_L1_LINK_WIDTH,
  COLLAPSED_L1_ROW_MARGIN_Y,
  getNavItemTransition,
  NAV_ITEM_HEIGHT,
} from '../tokens';
import { makeAccessible } from '~utils/makeAccessible';
import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';
import { PinIcon } from '~components/Icons';
import { makeBorderSize, makeSize, makeSpace } from '~utils';

const { HIDE_WHEN_COLLAPSED } = classes;

type SideNavPinItemProps = {
  /**
   * When true, the rail stays expanded (labels visible) until unpinned.
   */
  isPinned: boolean;
  onPinChange: (args: { isPinned: boolean }) => void;
  /**
   * @default 'Keep navigation open'
   */
  unpinnedTitle?: string;
  /**
   * @default 'Pinned open'
   */
  pinnedTitle?: string;
};

const StyledPinControl = styled(BaseBox)<{ $isPinned: boolean; $isIconOnly: boolean }>((props) => {
  const { colors, spacing, border } = props.theme;

  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: props.$isIconOnly ? 'center' : 'flex-start',
    gap: makeSpace(spacing[2]),
    boxSizing: 'border-box',
    width: props.$isIconOnly ? COLLAPSED_L1_LINK_WIDTH : '100%',
    height: makeSize(NAV_ITEM_HEIGHT),
    minHeight: makeSize(NAV_ITEM_HEIGHT),
    margin: props.$isIconOnly
      ? `${makeSize(COLLAPSED_L1_ROW_MARGIN_Y)} auto`
      : `${makeSpace(spacing[1])} ${makeSpace(spacing[0])}`,
    padding: props.$isIconOnly ? makeSpace(spacing[0]) : `0 ${makeSpace(spacing[3])}`,
    borderRadius: makeBorderSize(border.radius.small),
    borderWidth: makeBorderSize(border.width.none),
    cursor: 'pointer',
    textAlign: 'left',
    backgroundColor: props.$isPinned
      ? colors.interactive.background.primary.fadedHighlighted
      : colors.transparent,
    color: props.$isPinned
      ? colors.surface.text.primary.normal
      : colors.interactive.text.gray.subtle,
    transition: getNavItemTransition(props.theme),
    '&:hover': {
      backgroundColor: props.$isPinned
        ? colors.interactive.background.primary.fadedHighlighted
        : colors.interactive.background.primary.faded,
      color: props.$isPinned
        ? colors.surface.text.primary.normal
        : colors.interactive.text.gray.normal,
    },
    '&:focus-visible': {
      outline: `${makeBorderSize(border.width.thick)} solid ${colors.interactive.border.primary.default}`,
      outlineOffset: makeSpace(spacing[1]),
    },
  };
});

const SideNavPinItem = ({
  isPinned,
  onPinChange,
  unpinnedTitle = 'Keep navigation open',
  pinnedTitle = 'Pinned open',
}: SideNavPinItemProps): React.ReactElement => {
  const { isSideNavCollapsed, isL1Hovered, cancelScheduledRailPeekClose, notifyPinFromPeek } =
    useSideNav();
  const title = isPinned ? pinnedTitle : unpinnedTitle;
  const isIconOnly = Boolean(isSideNavCollapsed && !isL1Hovered);

  return (
    <StyledPinControl
      as="button"
      type="button"
      $isPinned={isPinned}
      $isIconOnly={isIconOnly}
      onPointerDown={() => {
        cancelScheduledRailPeekClose?.();
        if (!isPinned && isSideNavCollapsed && isL1Hovered) {
          notifyPinFromPeek?.();
        }
      }}
      onClick={() => {
        cancelScheduledRailPeekClose?.();
        onPinChange({ isPinned: !isPinned });
      }}
      {...makeAccessible({
        pressed: isPinned,
        label: isPinned ? 'Unpin navigation — stop keeping it open' : 'Keep navigation open',
      })}
    >
      <BaseBox display="flex" alignItems="center" flexShrink={0} aria-hidden>
        <PinIcon size="large" color="currentColor" />
      </BaseBox>
      <BaseText
        className={HIDE_WHEN_COLLAPSED}
        truncateAfterLines={1}
        fontWeight={isPinned ? 'semibold' : 'regular'}
        fontSize={100}
        lineHeight={100}
        color="currentColor"
        as="span"
      >
        {title}
      </BaseText>
    </StyledPinControl>
  );
};

export { SideNavPinItem };
export type { SideNavPinItemProps };
