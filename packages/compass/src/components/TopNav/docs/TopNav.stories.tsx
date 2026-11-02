/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { Title } from '@storybook/addon-docs/blocks';
import styled from 'styled-components';
import { TopNav, TopNavActions, TopNavContent, TopNavBrand } from '../TopNav';
import { topNavFullExample } from './code';
import storyRouterDecorator from '~utils/storybook/StoryRouter';
import { Box } from '~components/Box';
import type { SideNavLinkProps, SideNavProps } from '~components/SideNav';
import {
  SideNav,
  SideNavBody,
  SideNavLevel,
  SideNavLink,
  SideNavSection,
} from '~components/SideNav';
import {
  ActivityIcon,
  AnnouncementIcon,
  HomeIcon,
  LayoutIcon,
  PaymentButtonIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  AnimatedKlearIcon,
} from '~components/Icons';
import { TopNavBrandLogoPlaceholder } from './TopNavBrandLogoPlaceholder';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Tooltip } from '~components/Tooltip';
import { Avatar } from '~components/Avatar';
import { Text } from '~components/Typography';
import { Menu, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

import { Alert } from '~components/Alert';
import { List, ListItem } from '~components/List';
import { makeSize, useBreakpoint, useTheme } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import {
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
} from '~components/SideNav/tokens';
import BaseBox from '~components/Box/BaseBox';
import {
  AppShellMobileTopNav,
  AppShellMobileTopNavBrandOnly,
  AppShellTopNavActions,
} from '~components/SideNav/docs/appShellStoryShared';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const topNavStoryProfile = {
  name: 'Jordan Brooks',
  subtitle: 'Operations Admin',
} as const;

const DocsPage = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TopNav"
      componentDescription="The top navigation bar is positioned at the top of the screen that provides quick access to different products and user profile actions."
>
      <Title>Usage (with React Router v6)</Title>
      <Alert
        color="notice"
        title="State Management Note"
        description="TopNav component requires you to handle active link and active menu item on consumer end
        since the component is detached from React Router. The example below includes some boilerplate in handling these active states using React Router v6. For TopNav with SideNav, see **Full Example** or **Primary Variant**."
        isFullWidth
        isDismissible={false}
      />

      <Sandbox
        files={topNavFullExample}
        editorHeight={600}
        hideNavigation={false}
        openFile="SideNavExample.tsx,utils.tsx,App.tsx,TopNavExample.tsx"
      />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/TopNav',
  component: TopNav,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: DocsPage,
    },
  },
  decorators: [storyRouterDecorator(undefined, { initialEntries: ['/home'] })] as unknown,
} as Meta<typeof TopNav>;

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
): boolean => {
  const isCurrentPathActive = Boolean(
    matchPath(location.pathname, {
      path: href,
      exact: false,
    }),
  );

  const isSubItemActive = Boolean(
    activeOnLinks?.find((href) => matchPath(location.pathname, { path: href, exact: false })),
  );

  return isCurrentPathActive || isSubItemActive;
};

const NavLink = (
  props: Omit<SideNavLinkProps, 'as'> & {
    activeOnLinks?: string[];
  },
): React.ReactElement => {
  const location = useLocation();

  return (
    <SideNavLink
      {...props}
      as={Link}
      isActive={isItemActive(location, { href: props.href, activeOnLinks: props.activeOnLinks })}
    />
  );
};

const SideNavExample = ({
  isOpen,
  onDismiss,
}: Pick<SideNavProps, 'isOpen' | 'onDismiss'>): React.ReactElement => {
  return (
    <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
      <SideNavBody>
        <NavLink icon={HomeIcon} title="Home" href="/home" />
        <NavLink
          icon={LayoutIcon}
          title="L2 Trigger"
          href="/l2-item"
          activeOnLinks={['/l2-item', '/l2-item-2', '/l3-item', '/l3-item-2']}
        >
          <SideNavLevel>
            <NavLink title="L2 Item" href="/l2-item" />
            <NavLink title="L2 Item 2" href="/l2-item-2" />
            <NavLink title="L3 Trigger" activeOnLinks={['/l3-item', '/l3-item-2']}>
              <SideNavLevel>
                <NavLink title="L3 Item" href="/l3-item" />
                <NavLink title="L3 Item 2" href="/l3-item-2" />
              </SideNavLevel>
            </NavLink>
          </SideNavLevel>
        </NavLink>

        <SideNavSection title="Products" maxVisibleItems={2}>
          <NavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" />
          <NavLink icon={PaymentLinkIcon} title="Links" href="/links" />
          <NavLink icon={PaymentPagesIcon} title="Pages" href="/pages" />
          <NavLink icon={PaymentButtonIcon} title="Button" href="/button" />
        </SideNavSection>
      </SideNavBody>
    </SideNav>
  );
};

const getTopNavStoryShellBackground = (
  theme: ReturnType<typeof useTheme>['theme'],
  variant: NonNullable<React.ComponentProps<typeof TopNav>['variant']>,
): string => {
  const colorToken =
    variant === 'primary'
      ? 'surface.background.primary.intense'
      : 'interactive.background.staticBlack.default';

  return getIn(theme.colors, colorToken) as string;
};

const DashboardBackground = styled.div<{ background?: string }>(({ background }) => {
  return {
    height: '100vh',
    background: background ?? 'transparent',
  };
});

const TopNavFullExample = ({ variant = 'primary' }: { variant?: 'primary' | 'neutral' }) => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isMobile = matchedDeviceType === 'mobile';
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);

  const activeUrl = useLocation().pathname;

  const dashboardBgColor = getTopNavStoryShellBackground(theme, variant);

  return (
    <DashboardBackground background={dashboardBgColor}>
      <BaseBox>
        <TopNav variant={variant}>
          {isMobile ? (
            <AppShellMobileTopNav
              variant={variant}
              profile={topNavStoryProfile}
              onOpenNavigation={() => {
                setIsSideBarOpen(true);
              }}
            />
          ) : (
            <>
              <TopNavBrand>
                <TopNavBrandLogoPlaceholder />
              </TopNavBrand>
              <TopNavContent>{null}</TopNavContent>
              <TopNavActions>
                <AppShellTopNavActions profile={topNavStoryProfile} variant={variant} />
              </TopNavActions>
            </>
          )}
        </TopNav>
        <Box
          overflow="hidden"
          position="relative"
          zIndex={1}
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
          borderBottomLeftRadius="none"
          borderBottomRightRadius="none"
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <SideNavExample
            isOpen={isSideBarOpen}
            onDismiss={() => {
              setIsSideBarOpen(false);
            }}
          />
          <Box
            marginLeft={{
              base: '0px',
              m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
              xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
            }}
            height="calc(100vh - 58px)"
          >
            <Box
              height="100vh"
              padding="spacing.5"
              overflowY="scroll"
              backgroundColor="surface.background.gray.moderate"
            >
              <Box width={{ base: 'max-content', m: '100%' }} height="200vh">
                <Text weight="semibold">Active URL: {activeUrl}</Text>
                <Text marginY="spacing.4">This demo integrates:</Text>
                <List>
                  <ListItem>SideNav</ListItem>
                  <ListItem>React Router</ListItem>
                  <ListItem>Mobile responsiveness</ListItem>
                  <ListItem>Dashboard layout with TopNav variants</ListItem>
                </List>
              </Box>
            </Box>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};
const TopNavFullTemplate: StoryFn<typeof TopNav> = () => <TopNavFullExample />;

const TopNavMinimalTemplate: StoryFn<typeof TopNav> = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';
  const shellBackground = getTopNavStoryShellBackground(theme, 'primary');

  return (
    <DashboardBackground background={shellBackground}>
      <BaseBox>
        <TopNav variant="primary">
          {isMobile ? (
            <AppShellMobileTopNavBrandOnly profile={topNavStoryProfile} variant="primary" />
          ) : (
            <>
              <TopNavBrand>
                <TopNavBrandLogoPlaceholder />
              </TopNavBrand>
              <TopNavContent>{null}</TopNavContent>
              <TopNavActions>
                <AppShellTopNavActions profile={topNavStoryProfile} variant="primary" />
              </TopNavActions>
            </>
          )}
        </TopNav>
        <Box
          overflow="hidden"
          position="relative"
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
          borderBottomLeftRadius="none"
          borderBottomRightRadius="none"
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <Box
            height="calc(100vh - 58px)"
            padding="spacing.5"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text margin="spacing.5">
              Minimal TopNav: brand and actions only. See Full Example for SideNav and dashboard
              layout integration.
            </Text>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};

export const Minimal = TopNavMinimalTemplate.bind({});
Minimal.storyName = 'Minimal';

export const FullExample = TopNavFullTemplate.bind({});
FullExample.storyName = 'Full Example';

const TopNavActionsWithContextTemplate: StoryFn<typeof TopNav> = () => {
  const { theme } = useTheme();
  const shellBackground = getTopNavStoryShellBackground(theme, 'primary');

  return (
    <DashboardBackground background={shellBackground}>
      <TopNav variant="primary">
        <TopNavBrand>
          <TopNavBrandLogoPlaceholder />
        </TopNavBrand>
        <TopNavContent>{null}</TopNavContent>
        <TopNavActions>
        <Tooltip content="View Ecosystem Health">
          <IconButton
            size="medium"
            icon={ActivityIcon}
            onClick={noop}
            isHighlighted={true}
            emphasis="subtle"
            accessibilityLabel="View Ecosystem Health"
          />
        </Tooltip>
        <Tooltip content="View Announcements">
          <IconButton
            icon={AnnouncementIcon}
            onClick={noop}
            accessibilityLabel="View Announcements"
            isHighlighted={true}
            emphasis="subtle"
            size="medium"
          />
        </Tooltip>
        <Menu openInteraction="click">
          <Avatar size="small" name={topNavStoryProfile.name} />
          <MenuOverlay>
            <MenuHeader title="Profile" />
            <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
              <Avatar size="medium" name={topNavStoryProfile.name} />
              <Box display="flex" flexDirection="column" gap="spacing.2">
                <Text size="medium" weight="semibold">
                  {topNavStoryProfile.name}
                </Text>
                <Text size="xsmall" color="surface.text.gray.muted">
                  {topNavStoryProfile.subtitle}
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
        </TopNavActions>
      </TopNav>

      <Box
        overflow="hidden"
        position="relative"
        borderRadius={{ base: 'none', m: 'large' }}
        borderTopRightRadius={{ base: 'none', m: 'large' }}
        borderBottomLeftRadius="none"
        borderBottomRightRadius="none"
        height="100%"
        marginX={{ base: 'spacing.0', m: 'spacing.3' }}
      >
        <Box
          height="calc(100vh - 58px)"
          padding="spacing.5"
          backgroundColor="surface.background.gray.moderate"
        >
          <Text margin="spacing.5">
            This example shows `TopNavActions` used outside a full `TopNav` shell (e.g. embedded
            action rows). Wrap with `TopNav` when you need the full header layout.
          </Text>
        </Box>
      </Box>
    </DashboardBackground>
  );
};

export const TopNavActionsWithContext = TopNavActionsWithContextTemplate.bind({});
TopNavActionsWithContext.storyName = 'TopNavActions With Context';

const TopNavWithButtonTemplate: StoryFn<typeof TopNav> = () => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isMobile = matchedDeviceType === 'mobile';
  const shellBackground = getTopNavStoryShellBackground(theme, 'primary');

  return (
    <DashboardBackground background={shellBackground}>
      <BaseBox>
        <TopNav variant="primary">
          {isMobile ? (
            <AppShellMobileTopNavBrandOnly profile={topNavStoryProfile} variant="primary" />
          ) : (
            <>
              <TopNavBrand>
                <TopNavBrandLogoPlaceholder />
              </TopNavBrand>
              <TopNavContent>{null}</TopNavContent>
              <TopNavActions>
                <Button variant="primary" size="medium" icon={AnimatedKlearIcon}>
                  Klear Agent
                </Button>
                <Tooltip content="View Announcements">
                  <IconButton
                    icon={AnnouncementIcon}
                    onClick={noop}
                    accessibilityLabel="View Announcements"
                    isHighlighted={true}
                    emphasis="subtle"
                    size="medium"
                  />
                </Tooltip>
                <Menu openInteraction="click">
                  <Avatar size="small" name={topNavStoryProfile.name} />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                      <Avatar size="medium" name={topNavStoryProfile.name} />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          {topNavStoryProfile.name}
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          {topNavStoryProfile.subtitle}
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
              </TopNavActions>
            </>
          )}
        </TopNav>
        <Box
          overflow="hidden"
          position="relative"
          borderRadius={{ base: 'none', m: 'large' }}
          borderTopRightRadius={{ base: 'none', m: 'large' }}
          borderBottomLeftRadius="none"
          borderBottomRightRadius="none"
          height="100%"
          marginX={{ base: 'spacing.0', m: 'spacing.3' }}
        >
          <Box
            height="calc(100vh - 58px)"
            padding="spacing.5"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text margin="spacing.5">
              This example shows a Button inside TopNavActions alongside other action items.
            </Text>
          </Box>
        </Box>
      </BaseBox>
    </DashboardBackground>
  );
};

export const WithButton = TopNavWithButtonTemplate.bind({});
WithButton.storyName = 'With Button';

const TopNavNeutralVariantTemplate: StoryFn<typeof TopNav> = () => (
  <TopNavFullExample variant="neutral" />
);

export const NeutralVariant = TopNavNeutralVariantTemplate.bind({});
NeutralVariant.storyName = 'Neutral Variant';

const TopNavPrimaryVariantTemplate: StoryFn<typeof TopNav> = () => (
  <TopNavFullExample variant="primary" />
);

export const PrimaryVariant = TopNavPrimaryVariantTemplate.bind({});
PrimaryVariant.storyName = 'Primary Variant';
