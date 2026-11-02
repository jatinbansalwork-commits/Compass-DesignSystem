import type { Theme } from '~components/CompassProvider';
import { size } from '~tokens/global';
import { makeMotionTime } from '~utils';

const classes = {
  SHOW_WHEN_COLLAPSED: 'show-when-collapsed',
  HIDE_WHEN_COLLAPSED: 'hide-when-collapsed',
  COLLAPSED: 'collapsed',
  TRANSITIONING: 'transitioning',
  L1_ITEM_WRAPPER: 'l1-item-wrapper',
  SHOW_ON_LINK_HOVER: 'show-on-link-hover',
  STYLED_NAV_LINK: 'styled-nav-link',
} as const;

const SKIP_NAV_ID = 'blade-side-nav-skip';

const COLLAPSED_L1_WIDTH = size['56'];
/** KlearNow app shell (`localhost:3020`) — icon-only L1 hit target in collapsed rail. */
const COLLAPSED_L1_LINK_WIDTH = '39px';
/** Vertical margin per L1 row so row height ≈ 44px (40px target + 2×2px). */
const COLLAPSED_L1_ROW_MARGIN_Y = size['2'];
const SIDE_NAV_EXPANDED_L1_WIDTH_XL = size['264'];
const SIDE_NAV_EXPANDED_L1_WIDTH_BASE = size['240'];
const NAV_ITEM_HEIGHT = size['40'];

// This is the delay after which transition cleanup happens for rare cases where transitionEnd is not triggered
const TRANSITION_CLEANUP_DELAY = 300; // A little more than the duration of transition end

const HOVER_AGAIN_DELAY = 500;

// Delay between mouse out from L1 and L1 collapsing again
const L1_EXIT_HOVER_DELAY = 150;

/** Hover-intent delay for L2/L3 flyouts — matches KlearNow app shell (`INTENT_DELAY`). */
const FLYOUT_INTENT_DELAY = 280;

/** Horizontal overlap between cascaded flyout panels (px token). */
const FLYOUT_OVERLAP = 12;

/** KlearNow app-shell flyout panel (see localhost:3020 SideNav L2/L3 panels). */
const SIDENAV_FLYOUT_MIN_WIDTH = '208px';

const getSideNavFlyoutPanelProps = (): {
  backgroundColor: 'surface.background.gray.intense';
  borderRadius: 'medium';
  elevation: 'midRaised';
  padding: 'spacing.2';
  minWidth: string;
} => ({
  backgroundColor: 'surface.background.gray.intense',
  borderRadius: 'medium',
  elevation: 'midRaised',
  padding: 'spacing.2',
  minWidth: SIDENAV_FLYOUT_MIN_WIDTH,
});

const getNavItemTransition = ({ motion }: Theme): string => {
  return `background-color ${makeMotionTime(motion.duration['2xquick'])} ${motion.easing.standard}`;
};

export {
  SKIP_NAV_ID,
  classes,
  COLLAPSED_L1_WIDTH,
  COLLAPSED_L1_LINK_WIDTH,
  COLLAPSED_L1_ROW_MARGIN_Y,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  NAV_ITEM_HEIGHT,
  TRANSITION_CLEANUP_DELAY,
  HOVER_AGAIN_DELAY,
  getNavItemTransition,
  L1_EXIT_HOVER_DELAY,
  FLYOUT_INTENT_DELAY,
  FLYOUT_OVERLAP,
  SIDENAV_FLYOUT_MIN_WIDTH,
  getSideNavFlyoutPanelProps,
};
