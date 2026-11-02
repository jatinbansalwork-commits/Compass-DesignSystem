import React from 'react';
import styled from 'styled-components';
import { Box } from '~components/Box';
import { Skeleton } from '~components/Skeleton';
import { TopNavBrandLogoPlaceholder } from '~components/TopNav/docs/TopNavBrandLogoPlaceholder';
import {
  COLLAPSED_L1_WIDTH,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
} from '../tokens';
import { size } from '~tokens/global';
import { makeMotionTime, makeSize } from '~utils';

/** KlearNow app shell (`localhost:3020`) — TopNav height and horizontal inset for L1 rail. */
const APP_SHELL_TOP_NAV_HEIGHT = makeSize(size[56]);
const APP_SHELL_SIDE_NAV_INSET = 'spacing.2';

const MainWithSideNavOffset = styled(Box)<{ $animateMargin: boolean }>(({ theme, $animateMargin }) => {
  const xmoderate = makeMotionTime(theme.motion.duration.xmoderate);

  return {
    transition: $animateMargin
      ? `margin-left ${xmoderate} ${theme.motion.easing.entrance}`
      : 'none',
  };
});

type DashboardLayoutSkeletonHeaderProps = {
  /** L1 rail width on desktop — matches expanded vs collapsed SideNav. */
  isSideNavExpanded?: boolean;
};

const DashboardLayoutSkeletonHeader = ({
  isSideNavExpanded = true,
}: DashboardLayoutSkeletonHeaderProps): React.ReactElement => {
  const logoColumnWidth = isSideNavExpanded
    ? { base: undefined as undefined, m: '264px' as const }
    : { base: undefined as undefined, m: makeSize(COLLAPSED_L1_WIDTH) };

  return (
    <Box position="relative" display="flex" height={APP_SHELL_TOP_NAV_HEIGHT} alignItems="center" width="100%">
      <Box width={logoColumnWidth} display="flex" justifyContent="center" alignItems="center">
        <TopNavBrandLogoPlaceholder tone="onSurface" />
      </Box>
      <Box flex="1" display={{ base: 'none', m: 'block' }}>
        <Skeleton width="100%" height="12px" borderRadius="medium" />
      </Box>
      <Box flex="3" marginLeft="spacing.6" display={{ base: 'none', m: 'block' }}>
        <Skeleton marginBottom="spacing.2" width="100%" height="12px" borderRadius="medium" />
        <Skeleton width="100%" height="12px" borderRadius="medium" />
      </Box>
    </Box>
  );
};

/** Gray workspace + elevated inner panel (SideNav `position="absolute"` + main). */
const DashboardLayoutWorkspace = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box
      position="relative"
      borderRadius="large"
      overflow="hidden"
      paddingTop="spacing.4"
      flex="1"
      minHeight="0"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      elevation="midRaised"
      backgroundColor="surface.background.gray.intense"
      borderBottomWidth="none"
      borderBottomRightRadius="none"
      borderBottomLeftRadius="none"
    >
      {children}
    </Box>
  );
};

type DashboardLayoutShellProps = {
  header?: React.ReactNode;
  isSideNavExpanded?: boolean;
  children: React.ReactNode;
};

/** Legacy merchant / activation stories — skeleton header + workspace card. */
const DashboardLayoutShell = ({
  header,
  isSideNavExpanded = true,
  children,
}: DashboardLayoutShellProps): React.ReactElement => {
  return (
    <Box
      paddingX="spacing.4"
      backgroundColor="surface.background.gray.moderate"
      height="100%"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
    >
      {header ?? <DashboardLayoutSkeletonHeader isSideNavExpanded={isSideNavExpanded} />}
      <DashboardLayoutWorkspace>{children}</DashboardLayoutWorkspace>
    </Box>
  );
};

type AppShellLayoutProps = {
  topNav: React.ReactNode;
  isPinned: boolean;
  /** Unpinned rail temporarily expanded (hover / flyout) — dims main content like localhost:3020. */
  isRailPeeking?: boolean;
  onRailPeekDismiss?: () => void;
  /** One-shot: pin from peek — main offset jumps without margin transition. */
  instantMainMarginOnPin?: boolean;
  sideNav: React.ReactNode;
  children: React.ReactNode;
};

/**
 * KlearNow app shell geometry (3020):
 * - TopNav 56px full width on primary frame
 * - L1 rail at inset 8px below TopNav, width 56px (collapsed) / 240–264px (pinned)
 * - Main `#kn-content` at left inset 64px when collapsed (8 + 56)
 */
const AppShellLayout = ({
  topNav,
  isPinned,
  isRailPeeking = false,
  onRailPeekDismiss,
  instantMainMarginOnPin = false,
  sideNav,
  children,
}: AppShellLayoutProps): React.ReactElement => {
  const showPeekScrim = !isPinned && isRailPeeking;
  const animateMainMargin = !instantMainMarginOnPin;
  const railWidth = isPinned
    ? { base: 'spacing.0', m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE), xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL) }
    : { base: 'spacing.0', m: makeSize(COLLAPSED_L1_WIDTH) };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      backgroundColor="surface.background.primary.intense"
    >
      {topNav}
      <Box
        position="relative"
        flex="1"
        display="flex"
        minHeight={`calc(100vh - ${APP_SHELL_TOP_NAV_HEIGHT})`}
        paddingLeft={{ base: 'spacing.0', m: APP_SHELL_SIDE_NAV_INSET }}
        paddingRight={{ base: 'spacing.0', m: APP_SHELL_SIDE_NAV_INSET }}
        paddingBottom={{ base: 'spacing.0', m: APP_SHELL_SIDE_NAV_INSET }}
      >
        <Box
          position={{ base: 'fixed', m: 'absolute' }}
          top={{ base: APP_SHELL_TOP_NAV_HEIGHT, m: 'spacing.0' }}
          left={{ base: 'spacing.0', m: 'spacing.0' }}
          height={{ base: `calc(100vh - ${APP_SHELL_TOP_NAV_HEIGHT})`, m: '100%' }}
          zIndex={1}
          display={{ base: 'contents', m: 'block' }}
        >
          {sideNav}
        </Box>
        <MainWithSideNavOffset
          as="main"
          flex="1"
          width="100%"
          position="relative"
          $animateMargin={animateMainMargin}
          marginLeft={{ base: 'spacing.0', ...railWidth }}
          borderRadius={{ base: 'none', m: 'large' }}
          backgroundColor="surface.background.gray.intense"
          overflow="hidden"
          minHeight="100%"
        >
          {showPeekScrim ? (
            <Box
              position="absolute"
              top="spacing.0"
              left="spacing.0"
              right="spacing.0"
              bottom="spacing.0"
              zIndex={1}
              backgroundColor="surface.background.primary.intense"
              opacity="0.45"
              aria-hidden
              onClick={onRailPeekDismiss}
            />
          ) : null}
          <Box position="relative" zIndex={0} height="100%" width="100%">
            {children}
          </Box>
        </MainWithSideNavOffset>
      </Box>
    </Box>
  );
};

export {
  APP_SHELL_SIDE_NAV_INSET,
  APP_SHELL_TOP_NAV_HEIGHT,
  AppShellLayout,
  DashboardLayoutShell,
  DashboardLayoutSkeletonHeader,
  DashboardLayoutWorkspace,
  MainWithSideNavOffset,
};
