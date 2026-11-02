import React from 'react';
import { TopNavBrandLogoPlaceholder } from '~components/TopNav/docs/TopNavBrandLogoPlaceholder';
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

/** Three grid cells for `TopNav` on mobile: menu + brand, spacer, actions. */
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

/** Mobile TopNav without a menu control (stories that do not mount SideNav). */
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

export { AppShellTopNavActions, AppShellMobileTopNav, AppShellMobileTopNavBrandOnly, noop };
export type { AppShellStoryProfile };
