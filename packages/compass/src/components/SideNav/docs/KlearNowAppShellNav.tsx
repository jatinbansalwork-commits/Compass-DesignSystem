import React from 'react';
import { Link, matchPath, Route, Switch, useLocation } from 'react-router-dom';
import {
  SideNav,
  SideNavBody,
  SideNavFooter,
  SideNavLevel,
  SideNavLink,
  SideNavPinItem,
} from '..';
import type { SideNavLinkProps, SideNavProps } from '../types';
import type { IconComponent } from '~components/Icons';
import {
  BellIcon,
  BillIcon,
  BoxIcon,
  BuildingIcon,
  CashIcon,
  CodeSnippetIcon,
  CreditCardIcon,
  FilePlusIcon,
  FileTextIcon,
  GlobeIcon,
  LayoutIcon,
  MoveIcon,
  KlearIcon,
  ReportsIcon,
  SettingsIcon,
  StampIcon,
  TransactionsIcon,
  UserCheckIcon,
  UserIcon,
} from '~components/Icons';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { Card, CardBody } from '~components/Card';
import { Heading, Text } from '~components/Typography';
import { Indicator } from '~components/Indicator';
import { TopNavBrandLogoPlaceholder } from '~components/TopNav/docs/TopNavBrandLogoPlaceholder';
import { useIsMobile } from '~utils';
import {
  TopNav,
  TopNavActions,
  TopNavBrand,
  TopNavContent,
} from '~components/TopNav';
import {
  AppShellMobileTopNav,
  AppShellTopNavActions,
} from './appShellStoryShared';
import { AppShellLayout } from './dashboardLayoutShell';

type KlearNowNavItem = {
  icon: IconComponent;
  title: string;
  href: string;
  titleSuffix?: React.ReactNode;
  trailing?: React.ReactNode;
  tooltip?: SideNavLinkProps['tooltip'];
  l2Items?: { title: string; href: string; icon?: IconComponent }[];
};

const KLEAR_NOW_PIN_STORAGE_KEY = 'compass-sidenav-klearnow-app-shell-pin';

const readPinnedFromStorage = (): boolean => {
  try {
    return localStorage.getItem(KLEAR_NOW_PIN_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const writePinnedToStorage = (isPinned: boolean): void => {
  try {
    if (isPinned) {
      localStorage.setItem(KLEAR_NOW_PIN_STORAGE_KEY, '1');
    } else {
      localStorage.removeItem(KLEAR_NOW_PIN_STORAGE_KEY);
    }
  } catch {
    /* storage unavailable */
  }
};

/** L1 navigation aligned with KlearNow dashboard (`localhost:3020/dashboard`). */
const klearNowNavItems: KlearNowNavItem[] = [
  {
    icon: KlearIcon,
    title: 'Klear Agent',
    href: '/dashboard/klear-agent',
  },
  {
    icon: LayoutIcon,
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: SettingsIcon,
    title: 'Administration',
    href: '/dashboard/administration/role-management',
    l2Items: [
      { title: 'Role Management', href: '/dashboard/administration/role-management', icon: UserCheckIcon },
      { title: 'User Management', href: '/dashboard/administration/user-management', icon: UserIcon },
      {
        title: 'Contract Management',
        href: '/dashboard/administration/contract-management',
        icon: StampIcon,
      },
    ],
  },
  {
    icon: BuildingIcon,
    title: 'Entity Management',
    href: '/dashboard/entity-management',
    l2Items: [
      { title: 'Entities', href: '/dashboard/entity-management/entities' },
      { title: 'Relationships', href: '/dashboard/entity-management/relationships' },
    ],
  },
  {
    icon: BoxIcon,
    title: 'Master Data Management',
    href: '/dashboard/master-data',
    l2Items: [
      { title: 'Catalog', href: '/dashboard/master-data/catalog' },
      { title: 'Reference data', href: '/dashboard/master-data/reference' },
    ],
  },
  {
    icon: CashIcon,
    title: 'Finance Management',
    href: '/dashboard/finance',
    l2Items: [
      { title: 'Ledger', href: '/dashboard/finance/ledger' },
      { title: 'Reconciliation', href: '/dashboard/finance/reconciliation' },
    ],
  },
  {
    icon: BillIcon,
    title: 'Billing Management',
    href: '/dashboard/billing',
    l2Items: [
      { title: 'Invoices', href: '/dashboard/billing/invoices' },
      { title: 'Rates', href: '/dashboard/billing/rates' },
    ],
  },
  {
    icon: GlobeIcon,
    title: 'Klearhub',
    href: '/dashboard/klearhub',
    l2Items: [
      { title: 'Hub overview', href: '/dashboard/klearhub/overview' },
      { title: 'Connections', href: '/dashboard/klearhub/connections' },
    ],
  },
  {
    icon: CodeSnippetIcon,
    title: 'Intelligent OPS Hub',
    href: '/dashboard/intelligent-ops',
    l2Items: [
      { title: 'Workflows', href: '/dashboard/intelligent-ops/workflows' },
      { title: 'Automations', href: '/dashboard/intelligent-ops/automations' },
    ],
  },
  {
    icon: TransactionsIcon,
    title: 'Transaction Manager',
    href: '/dashboard/transactions',
    l2Items: [
      { title: 'Active transactions', href: '/dashboard/transactions/active' },
      { title: 'History', href: '/dashboard/transactions/history' },
    ],
  },
  {
    icon: MoveIcon,
    title: 'Drayage',
    href: '/dashboard/drayage',
    l2Items: [
      { title: 'Loads', href: '/dashboard/drayage/loads' },
      { title: 'Carriers', href: '/dashboard/drayage/carriers' },
    ],
  },
  {
    icon: ReportsIcon,
    title: 'Analytics',
    href: '/dashboard/analytics',
    l2Items: [
      { title: 'Reports', href: '/dashboard/analytics/reports' },
      { title: 'Dashboards', href: '/dashboard/analytics/dashboards' },
    ],
  },
  {
    icon: CreditCardIcon,
    title: 'Payment',
    href: '/dashboard/payment',
    l2Items: [
      { title: 'Payment methods', href: '/dashboard/payment/methods' },
      { title: 'Settlement', href: '/dashboard/payment/settlement' },
    ],
  },
  {
    icon: FileTextIcon,
    title: 'E-Invoices & Documents',
    href: '/dashboard/documents',
    l2Items: [
      { title: 'E-Invoices', href: '/dashboard/documents/e-invoices' },
      { title: 'Document library', href: '/dashboard/documents/library' },
    ],
  },
  {
    icon: BellIcon,
    title: 'Notification Management',
    href: '/dashboard/notifications',
    trailing: (
      <Badge color="primary" size="small">
        3
      </Badge>
    ),
  },
  {
    icon: FilePlusIcon,
    title: 'Content Management',
    href: '/dashboard/content',
    titleSuffix: (
      <Indicator
        emphasis="intense"
        color="primary"
        accessibilityLabel="New release notes"
      />
    ),
    l2Items: [
      { title: 'Release notes', href: '/dashboard/content/release-notes' },
      { title: 'Announcements', href: '/dashboard/content/announcements' },
    ],
  },
];

const collectNavHrefs = (items: KlearNowNavItem[]): string[] => {
  const hrefs: string[] = [];
  items.forEach((item) => {
    hrefs.push(item.href);
    item.l2Items?.forEach((l2) => {
      hrefs.push(l2.href);
    });
  });
  return hrefs;
};

export const KLEAR_NOW_APP_SHELL_ROUTES = collectNavHrefs(klearNowNavItems);

const isItemActive = (
  location: { pathname: string },
  { href, activeOnLinks }: { href?: string; activeOnLinks?: string[] },
): boolean => {
  const isCurrentPathActive = Boolean(
    matchPath(location.pathname, {
      path: href,
      exact: href === '/dashboard',
    }),
  );

  const isSubItemActive = Boolean(
    activeOnLinks?.find((linkHref) =>
      matchPath(location.pathname, { path: linkHref, exact: false }),
    ),
  );

  return isCurrentPathActive || isSubItemActive;
};

const KlearNowNavLink = (
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

const klearNowProfile = {
  name: 'John Doe',
  subtitle: 'Customs Broker',
} as const;

const KlearNowDashboardMain = (): React.ReactElement => {
  const location = useLocation();
  const isHome = location.pathname === '/dashboard';

  return (
    <Box padding="spacing.6" minHeight="100%">
      {isHome ? (
        <>
          <Heading size="large" weight="semibold">
            Dashboard
          </Heading>
          <Text marginTop="spacing.2" color="surface.text.gray.subtle">
            Overview of your trade operations.
          </Text>
          <Box
            display="flex"
            flexDirection={{ base: 'column', m: 'row' }}
            gap="spacing.4"
            marginTop="spacing.6"
          >
            {[
              { label: 'Active shipments', value: '128' },
              { label: 'Pending customs entries', value: '14' },
              { label: 'Documents awaiting review', value: '9' },
            ].map((metric) => (
              <Card key={metric.label} flex="1">
                <CardBody>
                  <Text size="small" color="surface.text.gray.subtle">
                    {metric.label}
                  </Text>
                  <Heading marginTop="spacing.2" size="large">
                    {metric.value}
                  </Heading>
                </CardBody>
              </Card>
            ))}
          </Box>
        </>
      ) : (
        <>
          <Heading size="large" weight="semibold">
            {location.pathname.split('/').filter(Boolean).slice(-1)[0]?.replace(/-/g, ' ') ??
              'Page'}
          </Heading>
          <Text marginTop="spacing.2" color="surface.text.gray.subtle">
            Active route: {location.pathname}
          </Text>
        </>
      )}
    </Box>
  );
};

type KlearNowAppShellSideNavProps = Pick<
  SideNavProps,
  'isOpen' | 'onDismiss' | 'position' | 'isRailPeeking' | 'onRailPeekChange'
> & {
  isPinned: boolean;
  onPinnedChange: (isPinned: boolean) => void;
};

const KlearNowAppShellSideNav = ({
  isOpen,
  onDismiss,
  position = 'absolute',
  isPinned,
  onPinnedChange,
  isRailPeeking,
  onRailPeekChange,
}: KlearNowAppShellSideNavProps): React.ReactElement => {
  return (
    <SideNav
      position={position}
      top="spacing.0"
      left="spacing.0"
      height="100%"
      isOpen={isOpen}
      onDismiss={onDismiss}
      isExpanded={isPinned ? true : false}
      isRailPeeking={isRailPeeking}
      onRailPeekChange={onRailPeekChange}
      l2Variant="flyout"
      l3Variant="flyout"
    >
      <SideNavBody>
        {klearNowNavItems.map((item) => {
          const l2Hrefs = item.l2Items?.map((l2) => l2.href) ?? [];

          if (!item.l2Items?.length) {
            return (
              <KlearNowNavLink
                key={item.title}
                icon={item.icon}
                title={item.title}
                href={item.href}
                trailing={item.trailing}
                titleSuffix={item.titleSuffix}
                tooltip={item.tooltip}
              />
            );
          }

          return (
            <KlearNowNavLink
              key={item.title}
              icon={item.icon}
              title={item.title}
              href={item.l2Items[0].href}
              activeOnLinks={l2Hrefs}
              trailing={item.trailing}
              titleSuffix={item.titleSuffix}
            >
              <SideNavLevel>
                {item.l2Items.map((l2) => (
                  <KlearNowNavLink
                    key={l2.href}
                    title={l2.title}
                    href={l2.href}
                    icon={l2.icon}
                  />
                ))}
              </SideNavLevel>
            </KlearNowNavLink>
          );
        })}
      </SideNavBody>
      <SideNavFooter>
        <SideNavPinItem
          isPinned={isPinned}
          onPinChange={({ isPinned: next }) => {
            onPinnedChange(next);
          }}
        />
      </SideNavFooter>
    </SideNav>
  );
};

type KlearNowAppShellExampleProps = {
  topNavVariant?: NonNullable<React.ComponentProps<typeof TopNav>['variant']>;
};

const KlearNowAppShellExample = ({
  topNavVariant = 'primary',
}: KlearNowAppShellExampleProps): React.ReactElement => {
  const isMobile = useIsMobile();
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [isPinned, setIsPinned] = React.useState(readPinnedFromStorage);
  const [isRailPeeking, setIsRailPeeking] = React.useState(false);
  const [instantMainMarginOnPin, setInstantMainMarginOnPin] = React.useState(false);

  React.useLayoutEffect(() => {
    if (!instantMainMarginOnPin) {
      return;
    }
    setInstantMainMarginOnPin(false);
  }, [isPinned, instantMainMarginOnPin]);

  const handlePinnedChange = (nextPinned: boolean): void => {
    if (nextPinned && isRailPeeking) {
      setInstantMainMarginOnPin(true);
      setIsRailPeeking(false);
    }
    setIsPinned(nextPinned);
    writePinnedToStorage(nextPinned);
  };

  return (
    <AppShellLayout
      isPinned={isPinned}
      isRailPeeking={isRailPeeking}
      instantMainMarginOnPin={instantMainMarginOnPin}
      onRailPeekDismiss={() => {
        setIsRailPeeking(false);
      }}
      topNav={
        <TopNav variant={topNavVariant}>
          {isMobile ? (
            <AppShellMobileTopNav
              variant={topNavVariant}
              profile={klearNowProfile}
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
                <AppShellTopNavActions profile={klearNowProfile} variant={topNavVariant} />
              </TopNavActions>
            </>
          )}
        </TopNav>
      }
      sideNav={
        <KlearNowAppShellSideNav
          isOpen={isSideBarOpen}
          onDismiss={() => {
            setIsSideBarOpen(false);
          }}
          isPinned={isPinned}
          onPinnedChange={handlePinnedChange}
          isRailPeeking={isRailPeeking}
          onRailPeekChange={({ isPeeking }) => {
            setIsRailPeeking(isPeeking);
          }}
        />
      }
    >
      <Box height="100%" overflowY="auto">
        <Switch>
          <Route exact path="/dashboard" component={KlearNowDashboardMain} />
          {KLEAR_NOW_APP_SHELL_ROUTES.filter((route) => route !== '/dashboard').map((route) => (
            <Route key={route} path={route} component={KlearNowDashboardMain} />
          ))}
        </Switch>
      </Box>
    </AppShellLayout>
  );
};

export {
  KlearNowAppShellExample,
  KlearNowAppShellSideNav,
  klearNowNavItems,
  readPinnedFromStorage,
  writePinnedToStorage,
};
