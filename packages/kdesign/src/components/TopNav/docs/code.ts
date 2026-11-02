import dedent from 'dedent';

export const topNavFullExample = {
  'App.tsx': dedent`import React from 'react';
  import { BrowserRouter } from 'react-router-dom';
  import { TopNavExample } from './TopNavExample';
  
  const App = () => {
    return (
      <BrowserRouter>
        <TopNavExample />
      </BrowserRouter>
    );
  };

  export default App;
  `,
  'TopNavExample.tsx': dedent`import React from "react";
  import styled from "styled-components";
  import { Link, useLocation } from "react-router-dom";
  import { SideNavExample } from "./SideNavExample";
  import { isItemActive, TopNavBrandLogoPlaceholder } from "./utils";
  import {
    Box,
    Text,
    Heading,
    TopNav,
    TopNavBrand,
    TopNavContent,
    TopNavActions,
    Menu,
    MenuItem,
    MenuOverlay,
    MenuHeader,
    useTheme,
    HomeIcon,
    Button,
    Link as KdesignLink,
    Avatar,
    Tooltip,
    ActivityIcon,
    AnnouncementIcon,
    List,
    ListItem,
    SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
    SIDE_NAV_EXPANDED_L1_WIDTH_XL,
  } from "@klearnow/kdesign/components";
  import { makeSize } from "@klearnow/kdesign/utils";

  const DashboardBackground = styled.div(({ $background }) => {
    return {
      height: "100vh",
      background: $background,
    };
  });

  const TopNavExample = () => {
    const { platform, theme } = useTheme();
    const isMobile = platform === "onMobile";
    const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
    const shellBackground = theme.colors.surface.background.primary.intense;

    const activeUrl = useLocation().pathname;

    return (
      <DashboardBackground $background={shellBackground}>
        <Box backgroundColor="surface.background.gray.subtle">
          <TopNav variant="primary">
            {isMobile ? (
              <>
                <KdesignLink icon={HomeIcon} size="medium" href="/home">
                  Home
                </KdesignLink>
                <Heading textAlign="center" size="small" weight="semibold">
                  Payments
                </Heading>
                <Menu openInteraction="click">
                  <Avatar size="medium" name="Jordan Brooks" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box
                      display="flex"
                      gap="spacing.4"
                      padding="spacing.4"
                      alignItems="center"
                    >
                      <Avatar size="medium" name="Jordan Brooks" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          Jordan Brooks
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          Operations Admin
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
            ) : (
              <>
                <TopNavBrand>
                  <TopNavBrandLogoPlaceholder />
                </TopNavBrand>
                <TopNavContent>{null}</TopNavContent>
                <TopNavActions>
                  <Tooltip content="View Ecosystem Health">
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="tertiary"
                      icon={ActivityIcon}
                    />
                  </Tooltip>
                  <Tooltip content="View Announcements">
                    <Button
                      size={isMobile ? "small" : "medium"}
                      variant="tertiary"
                      icon={AnnouncementIcon}
                    />
                  </Tooltip>
                  <Menu openInteraction="click">
                    <Avatar size="medium" name="Jordan Brooks" />
                    <MenuOverlay>
                      <MenuHeader title="Profile" />
                      <Box
                        display="flex"
                        gap="spacing.4"
                        padding="spacing.4"
                        alignItems="center"
                      >
                        <Avatar size="medium" name="Jordan Brooks" />
                        <Box
                          display="flex"
                          flexDirection="column"
                          gap="spacing.2"
                        >
                          <Text size="medium" weight="semibold">
                            Jordan Brooks
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            Operations Admin
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
            borderRadius="large"
            borderTopRightRadius="none"
            borderBottomLeftRadius="none"
            borderBottomRightRadius="none"
            height="100%"
            marginX={{ base: "spacing.0", m: "spacing.3" }}
          >
            <SideNavExample
              isOpen={isSideBarOpen}
              onDismiss={() => {
                setIsSideBarOpen(false);
              }}
            />
            <Box
              marginLeft={{
                base: "100%",
                m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
                xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
              }}
              // 100vh - (topnav height [56px] + border [2px])
              height="calc(100vh - 58px)"
            >
              <Box
                height="100vh"
                padding="spacing.5"
                overflowY="scroll"
                backgroundColor="surface.background.gray.moderate"
              >
                <Box width={{ base: "max-content", m: "100%" }} height="200vh">
                  <Text marginBottom="spacing.4">This demo integrates:</Text>
                  <List>
                    <ListItem>SideNav</ListItem>
                    <ListItem>Menu (Explore Tab)</ListItem>
                    <ListItem>ReactRouter</ListItem>
                    <ListItem>Mobile Responsiveness</ListItem>
                    <ListItem>One Dashboard Layout</ListItem>
                  </List>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DashboardBackground>
    );
  };

  export { TopNavExample };
  `,
  'SideNavExample.tsx': dedent`import React from "react";
  import { Link, useLocation } from "react-router-dom";
  import { isItemActive } from "./utils";
  import {
    SideNav,
    SideNavBody,
    SideNavLevel,
    SideNavLink,
    SideNavSection,
    HomeIcon,
    LayoutIcon,
    PaymentButtonIcon,
    PaymentGatewayIcon,
    PaymentLinkIcon,
    PaymentPagesIcon,
  } from "@klearnow/kdesign/components";

  const NavLink = (
    props
  ) => {
    const location = useLocation();

    return (
      <SideNavLink
        {...props}
        as={Link}
        isActive={isItemActive(location, {
          href: props.href,
          activeOnLinks: props.activeOnLinks,
        })}
      />
    );
  };

  const SideNavExample = ({
    isOpen,
    onDismiss,
  }) => {
    return (
      <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
        <SideNavBody>
          <NavLink icon={HomeIcon} title="Home" href="/home" />
          <NavLink
            icon={LayoutIcon}
            title="L2 Trigger"
            href="/l2-item"
            activeOnLinks={["/l2-item", "/l2-item-2", "/l3-item", "/l3-item-2"]}
          >
            <SideNavLevel>
              <NavLink title="L2 Item" href="/l2-item" />
              <NavLink title="L2 Item 2" href="/l2-item-2" />
              <NavLink
                title="L3 Trigger"
                activeOnLinks={["/l3-item", "/l3-item-2"]}
              >
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

  export { SideNavExample };
`,
  'utils.tsx': dedent`import React from 'react';
  import { matchPath } from "react-router-dom";
  import { Box } from '@klearnow/kdesign/components';

  const isItemActive = (
    location,
    { href, activeOnLinks }
  ) => {
    const isCurrentPathActive = Boolean(matchPath(location.pathname, href));

    const isSubItemActive = Boolean(
      activeOnLinks?.find((href) => matchPath(location.pathname, href))
    );

    return isCurrentPathActive || isSubItemActive;
  };

  const TopNavBrandLogoPlaceholder = () => (
    <Box
      role="img"
      aria-label="Application logo placeholder"
      width="116px"
      height="24px"
      borderRadius="small"
      borderWidth="thin"
      borderStyle="dashed"
      borderColor="interactive.border.staticWhite.faded"
      backgroundColor="interactive.background.staticWhite.faded"
    />
  );

  export { isItemActive, TopNavBrandLogoPlaceholder };
`,
};
