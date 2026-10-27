import React from 'react';
import {
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItems,
  TabNavItem,
  Avatar,
  IconButton,
  SearchInput,
} from '@klearnow/compass/components';
import {
  HomeIcon,
  AcceptPaymentsIcon,
  AcceptPaymentsFilledIcon,
  ShoppingBagIcon,
  MagicCheckoutFilledIcon,
  ActivityIcon,
  AnnouncementIcon,
} from '@klearnow/compass/components';

const KlearnowLogo = () => (
  <svg width="120" height="24" viewBox="0 0 120 24" fill="white">
    <rect width="24" height="24" rx="4" />
    <text x="32" y="17" fill="white" fontSize="14" fontWeight="600">
      Klearnow
    </text>
  </svg>
);

export const Minimal = () => (
  <TopNav>
    <TopNavBrand>
      <KlearnowLogo />
    </TopNavBrand>
    <TopNavContent>
      <TabNav items={[{ title: 'Home', href: '/home', icon: HomeIcon }]}>
        {({ items }) => (
          <TabNavItems>
            {items.map((item) => (
              <TabNavItem key={item.title} {...item} isActive={item.href === '/home'} />
            ))}
          </TabNavItems>
        )}
      </TabNav>
    </TopNavContent>
    <TopNavActions>
      <Avatar size="small" name="John Doe" />
    </TopNavActions>
  </TopNav>
);

export const WithMultipleTabs = () => (
  <TopNav>
    <TopNavBrand>
      <KlearnowLogo />
    </TopNavBrand>
    <TopNavContent>
      <TabNav
        items={[
          { title: 'Home', href: '/home', icon: HomeIcon },
          {
            href: '/payments',
            title: 'Payments',
            icon: { default: AcceptPaymentsIcon, selected: AcceptPaymentsFilledIcon },
          },
          {
            href: '/checkout',
            title: 'Checkout',
            icon: { default: ShoppingBagIcon, selected: MagicCheckoutFilledIcon },
          },
        ]}
      >
        {({ items }) => (
          <TabNavItems>
            {items.map((item) => (
              <TabNavItem key={item.title} {...item} isActive={item.href === '/payments'} />
            ))}
          </TabNavItems>
        )}
      </TabNav>
    </TopNavContent>
    <TopNavActions>
      <IconButton icon={ActivityIcon} accessibilityLabel="Activity" size="medium" />
      <IconButton icon={AnnouncementIcon} accessibilityLabel="Announcements" size="medium" />
      <Avatar size="small" name="Anurag Hazra" />
    </TopNavActions>
  </TopNav>
);

export const WithSearch = () => (
  <TopNav>
    <TopNavBrand>
      <KlearnowLogo />
    </TopNavBrand>
    <TopNavContent>
      <TabNav
        items={[
          { title: 'Home', href: '/home', icon: HomeIcon },
          { title: 'Payments', href: '/payments', icon: AcceptPaymentsIcon },
        ]}
      >
        {({ items }) => (
          <TabNavItems>
            {items.map((item) => (
              <TabNavItem key={item.title} {...item} isActive={item.href === '/home'} />
            ))}
          </TabNavItems>
        )}
      </TabNav>
    </TopNavContent>
    <TopNavActions>
      <SearchInput placeholder="Search" accessibilityLabel="Search" />
      <IconButton icon={AnnouncementIcon} accessibilityLabel="Announcements" size="medium" />
      <Avatar size="small" name="John Doe" />
    </TopNavActions>
  </TopNav>
);

export const PrimaryVariant = () => (
  <TopNav variant="primary">
    <TopNavBrand>
      <KlearnowLogo />
    </TopNavBrand>
    <TopNavContent>
      <TabNav
        items={[
          { title: 'Home', href: '/home', icon: HomeIcon },
          { title: 'Payments', href: '/payments', icon: AcceptPaymentsIcon },
        ]}
      >
        {({ items }) => (
          <TabNavItems>
            {items.map((item) => (
              <TabNavItem key={item.title} {...item} isActive={item.href === '/payments'} />
            ))}
          </TabNavItems>
        )}
      </TabNav>
    </TopNavContent>
    <TopNavActions>
      <IconButton
        icon={ActivityIcon}
        accessibilityLabel="Activity"
        size="medium"
        emphasis="subtle"
      />
      <Avatar size="small" name="Anurag Hazra" />
    </TopNavActions>
  </TopNav>
);
