import React from 'react';
import { TopNavBrand, TopNavContent, TopNavActions } from '../TopNav';
import { TopNavBrandLogoPlaceholder } from './TopNavBrandLogoPlaceholder';
import { Box } from '~components/Box';
import { IconButton } from '~components/Button/IconButton';
import { Tooltip } from '~components/Tooltip';
import { ActivityIcon, AnnouncementIcon, MenuIcon, AnimatedKlearIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Avatar } from '~components/Avatar';
import { Text } from '~components/Typography';
import { Menu, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

type AppShellStoryProfile = {
  name: string;
  subtitle: string;
};

type AppShellTopNavActionsProps = {
  profile: AppShellStoryProfile;
  variant?: 'primary' | 'neutral';
  isMobile?: boolean;
};

/**
 * Standard KlearNow utility cluster for app-shell TopNav: branded CTA, health, announcements, profile menu.
 * On `variant="primary"`, icon buttons use `emphasis="subtle"` so they read on the brand bar.
 */
const AppShellTopNavActions = ({
  profile,
  variant = 'primary',
  isMobile = false,
}: AppShellTopNavActionsProps): React.ReactElement => {
  const actionSize = isMobile ? 'small' : 'medium';
  const emphasis = variant === 'primary' ? 'subtle' : undefined;

  return (
    <>
      <Button variant="primary" size={actionSize} icon={AnimatedKlearIcon} onClick={noop}>
        Klear Agent
      </Button>
      <Tooltip content="View Ecosystem Health">
        <IconButton
          size={actionSize}
          icon={ActivityIcon}
          onClick={noop}
          accessibilityLabel="View Ecosystem Health"
          isHighlighted={true}
          emphasis={emphasis}
        />
      </Tooltip>
      <Tooltip content="View Announcements">
        <IconButton
          size={actionSize}
          icon={AnnouncementIcon}
          onClick={noop}
          emphasis={emphasis}
          accessibilityLabel="View Announcements"
          isHighlighted={true}
        />
      </Tooltip>
      <Menu openInteraction="click">
        <Avatar size="small" name={profile.name} />
        <MenuOverlay>
          <MenuHeader title="Profile" />
          <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
            <Avatar size="medium" name={profile.name} />
            <Box display="flex" flexDirection="column" gap="spacing.2">
              <Text size="medium" weight="semibold">
                {profile.name}
              </Text>
              <Text size="xsmall" color="surface.text.gray.muted">
                {profile.subtitle}
              </Text>
            </Box>
          </Box>
          <MenuItem>
            <Text color="surface.text.gray.subtle">Settings</Text>
          </MenuItem>
          <MenuItem color="negative">
            <Text color="feedback.text.negative.intense">Logout</Text>
          </MenuItem>
        </MenuOverlay>
      </Menu>
    </>
  );
};

type AppShellMobileTopNavProps = {
  profile: AppShellStoryProfile;
  variant?: 'primary' | 'neutral';
  onOpenNavigation: () => void;
};

/** Mobile: three direct children of `TopNav` — (menu + brand) | spacer | actions. */
const AppShellMobileTopNav = ({
  profile,
  variant = 'primary',
  onOpenNavigation,
}: AppShellMobileTopNavProps): React.ReactElement => {
  const emphasis = variant === 'primary' ? 'subtle' : undefined;

  return (
    <>
      <Box display="flex" alignItems="center" gap="spacing.2" marginLeft="spacing.2">
        <IconButton
          icon={MenuIcon}
          size="medium"
          variant="tertiary"
          emphasis={emphasis}
          onClick={onOpenNavigation}
          accessibilityLabel="Open main menu"
        />
        <TopNavBrandLogoPlaceholder />
      </Box>
      <Box />
      <Box marginRight="spacing.2" display="flex" alignItems="center">
        <AppShellTopNavActions profile={profile} variant={variant} isMobile />
      </Box>
    </>
  );
};

/** Mobile TopNav without a menu control (no SideNav on the page). */
const AppShellMobileTopNavBrandOnly = ({
  profile,
  variant = 'primary',
}: Omit<AppShellMobileTopNavProps, 'onOpenNavigation'>): React.ReactElement => {
  return (
    <>
      <Box display="flex" alignItems="center" marginLeft="spacing.2">
        <TopNavBrandLogoPlaceholder />
      </Box>
      <Box />
      <Box marginRight="spacing.2" display="flex" alignItems="center">
        <AppShellTopNavActions profile={profile} variant={variant} isMobile />
      </Box>
    </>
  );
};

type AppShellDesktopTopNavProps = {
  profile: AppShellStoryProfile;
  variant?: 'primary' | 'neutral';
  brand?: React.ReactNode;
  /** Center column — `TabNav` for multi-product apps, or empty for single-app SideNav shells. */
  content?: React.ReactNode;
  actions?: React.ReactNode;
};

/**
 * Desktop: canonical three-slot layout matching `TopNav` grid (`auto | minmax(0, 1fr) | auto`).
 * Wrap with `<TopNav variant={...}>`; pair with `AppShellLayout` + `SideNav` for KlearNow shells.
 */
const AppShellDesktopTopNav = ({
  profile,
  variant = 'primary',
  brand,
  content = null,
  actions,
}: AppShellDesktopTopNavProps): React.ReactElement => {
  return (
    <>
      <TopNavBrand>{brand ?? <TopNavBrandLogoPlaceholder />}</TopNavBrand>
      <TopNavContent>{content}</TopNavContent>
      <TopNavActions>
        {actions ?? <AppShellTopNavActions profile={profile} variant={variant} />}
      </TopNavActions>
    </>
  );
};

type AppShellTopNavSlotsProps = {
  profile: AppShellStoryProfile;
  variant?: 'primary' | 'neutral';
  isMobile: boolean;
  onOpenNavigation?: () => void;
  brand?: React.ReactNode;
  content?: React.ReactNode;
  actions?: React.ReactNode;
  /** Mobile layout without menu button (SideNav not mounted). */
  mobileBrandOnly?: boolean;
};

/** Responsive app-shell TopNav children — mobile three-cell row or desktop Brand / Content / Actions. */
const AppShellTopNavSlots = ({
  profile,
  variant = 'primary',
  isMobile,
  onOpenNavigation,
  brand,
  content,
  actions,
  mobileBrandOnly = false,
}: AppShellTopNavSlotsProps): React.ReactElement => {
  if (isMobile) {
    if (mobileBrandOnly) {
      return <AppShellMobileTopNavBrandOnly profile={profile} variant={variant} />;
    }
    if (!onOpenNavigation) {
      throw new Error(
        'AppShellTopNavSlots: onOpenNavigation is required when isMobile and not mobileBrandOnly',
      );
    }
    return (
      <AppShellMobileTopNav
        profile={profile}
        variant={variant}
        onOpenNavigation={onOpenNavigation}
      />
    );
  }

  return (
    <AppShellDesktopTopNav
      profile={profile}
      variant={variant}
      brand={brand}
      content={content}
      actions={actions}
    />
  );
};

export {
  AppShellTopNavActions,
  AppShellMobileTopNav,
  AppShellMobileTopNavBrandOnly,
  AppShellDesktopTopNav,
  AppShellTopNavSlots,
  noop,
};
export type { AppShellStoryProfile };
