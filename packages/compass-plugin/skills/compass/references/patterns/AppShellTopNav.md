# App Shell TopNav Pattern

## Pattern Name

App Shell TopNav

## Description

App Shell TopNav is the standard header for KlearNow dashboard shells: a sticky 56px bar that stays on the primary frame while SideNav and workspace content sit below. It uses Compass `TopNav` with a fixed three-column layout on desktop and a flattened three-cell row on mobile. Deep navigation lives in `SideNav`; product switching (when needed) belongs in `TopNavContent` via `TabNav`.

Use this pattern with `AppShellLayout` (see SideNav Storybook / KlearNow app shell examples) so TopNav, L1 rail inset, and main panel radii stay aligned.

## Components Used

Read `references/components/<Name>.md` for full props and API. The table below is how each piece fits **this** pattern.

| Component | Required | Pattern role |
|-----------|----------|----------------|
| **TopNav** | Yes | Root sticky header (56px). Set `variant="primary"` for KlearNow shells. |
| **TopNavBrand** | Desktop | Start column: product logo or mark. |
| **TopNavContent** | Yes (slot) | Center column: **`TabNav`** for multi-product apps, or **`null`** when SideNav owns IA. |
| **TopNavActions** | Desktop | End column: horizontal cluster (CTA, utilities, profile). |
| **Box** | Mobile | Center grid cell as empty spacer; flex wrapper for menu + logo in start cell. |
| **IconButton** | Mobile + utilities | Menu control (`MenuIcon`) opens SideNav drawer; highlighted utility actions in actions cluster. |
| **Button** | Typical | Primary CTA in actions (e.g. “Klear Agent”) — `variant="primary"`, `size="medium"` desktop / `small` mobile. |
| **TopNavBrandedActionPill** | Optional | Branded icon + label CTA instead of `Button` when design calls for a pill on the bar. |
| **Tooltip** | Recommended | Wrap icon-only utility buttons with accessible labels. |
| **Avatar** | Typical | Profile trigger for account menu (`size="small"` in bar, `medium` in menu header). |
| **Menu** | Typical | Profile dropdown — `openInteraction="click"`. |
| **MenuOverlay** | With Menu | Dropdown surface for profile content. |
| **MenuHeader** | Typical | Profile section title (e.g. “Profile”). |
| **MenuItem** | Typical | Settings, logout, and other account actions. |
| **Text** | With Menu | Name and subtitle in profile header. |
| **TabNav** | Multi-product only | Product switcher inside `TopNavContent`; use render-prop API for overflow “More” menu. |
| **TabNavItems** | With TabNav | Container for visible tab items. |
| **TabNavItem** | With TabNav | One product tab; active state from app routing. |
| **SideNav** | Full shell | Vertical IA below TopNav — not a child of TopNav, but required for KlearNow app shell. |
| **SideNavBody** | With SideNav | L1/L2 links. |
| **SideNavLink** | With SideNav | Nav entries; pair with React Router via `as={Link}`. |
| **SideNavPinItem** | KlearNow rail | Pin/unpin expanded L1 rail (desktop). |
| **SideNavLevel** | With L2/L3 | Nested links under an L1 item; use `l2Variant="flyout"` on `SideNav` for KlearNow. |
| **SideNavFooter** | KlearNow rail | Footer slot for pin control. |
| **Badge** | Optional | `SideNavLink` `trailing` (e.g. notification count). |
| **Indicator** | Optional | `SideNavLink` `titleSuffix` (e.g. unread dot). |

### Workspace (`<main>` scroll region)

Content below the shell chrome — not part of TopNav, but defined in the same Storybook stories.

| Component | Required | Pattern role |
|-----------|----------|----------------|
| **Box** | Yes | Page padding (`spacing.6`), layout wrappers, table overflow container. |
| **Heading** | Typical | L1 page title (`size="large"`, `weight="semibold"`). |
| **Text** | Typical | Page subtitle / route hint (`color="surface.text.gray.subtle"`). |
| **Card** | Dashboard home | Metric tiles in a responsive row. |
| **CardBody** | With Card | Metric label + value stack. |
| **Table** | List routes | Primary data surface for entity/list pages (e.g. Transaction Manager). |
| **TableHeader** | With Table | Column headers. |
| **TableHeaderRow** | With Table | Header row wrapper. |
| **TableHeaderCell** | With Table | One column title. |
| **TableBody** | With Table | Data rows. |
| **TableRow** | With Table | One record; pass `item` for row identity. |
| **TableCell** | With Table | Cell content; may include **Badge** for status. |
| **List** | Demo / docs | Bulleted integration notes in **TopNav → Full Example** only. |
| **ListItem** | With List | Single list row in that demo. |

For filters, search, pagination, and toolbar actions on list pages, use the **ListView** pattern on top of **Table** — do not duplicate that chrome in TopNav.

### Storybook → pattern component map

Source files and which Compass components each story exercises.

#### SideNav → **KlearNow App Shell**

Reference: `packages/compass/src/components/SideNav/docs/KlearNowAppShellNav.tsx`, workspace in `klearNowAppShellWorkspace.tsx`.

| Layer | Components |
|-------|------------|
| Layout | `Box` (`AppShellLayout` in `dashboardLayoutShell.tsx`) |
| TopNav | `TopNav`, `AppShellTopNavSlots` → `TopNavBrand`, `TopNavContent`, `TopNavActions`, `Button`, `IconButton`, `Tooltip`, `Avatar`, `Menu`, `MenuOverlay`, `MenuHeader`, `MenuItem`, `Text` |
| SideNav | `SideNav`, `SideNavBody`, `SideNavLink`, `SideNavLevel`, `SideNavFooter`, `SideNavPinItem`, `Badge`, `Indicator` |
| Workspace — home (`/dashboard`) | `Box`, `Heading`, `Text`, `Card`, `CardBody` |
| Workspace — transactions | `Box`, `Heading`, `Text`, `Table`, `TableHeader`, `TableHeaderRow`, `TableHeaderCell`, `TableBody`, `TableRow`, `TableCell`, `Badge` |
| Workspace — other routes | `Box`, `Heading`, `Text` |
| Routing | React Router `Switch`, `Route`, `Link`, `useLocation`, `matchPath` (app-owned) |

#### TopNav → **Full Example**

Reference: `packages/compass/src/components/TopNav/docs/TopNav.stories.tsx` (`TopNavFullExample`).

| Layer | Components |
|-------|------------|
| TopNav | `TopNav`, `AppShellTopNavSlots` |
| SideNav | `SideNav`, `SideNavBody`, `SideNavLink`, `SideNavLevel`, `SideNavSection` |
| Workspace demo | `BaseBox`, `Box`, `Text`, `List`, `ListItem` |

#### TopNav → **Minimal**

| Layer | Components |
|-------|------------|
| TopNav | `TopNav`, `AppShellTopNavSlots` (`mobileBrandOnly`) |
| Workspace | `BaseBox`, `Box`, `Text` |

#### Pattern helpers (Storybook only)

| File | Exports |
|------|---------|
| `TopNav/docs/topNavAppShellPattern.tsx` | `AppShellTopNavSlots`, `AppShellDesktopTopNav`, `AppShellMobileTopNav`, `AppShellTopNavActions`, … |
| `SideNav/docs/klearNowAppShellWorkspace.tsx` | `KlearNowAppShellMainWorkspace`, `KlearNowTransactionManagerWorkspace`, `KlearNowDashboardHomeWorkspace` |

### TopNav structure (desktop)

```
TopNav (variant="primary" | "neutral")
├── TopNavBrand
│   └── logo / TopNavBrandLogoPlaceholder (app-owned)
├── TopNavContent
│   ├── (empty) — single-app KlearNow shell
│   └── TabNav — multi-product only
│       └── children render prop → TabNavItems → TabNavItem…
└── TopNavActions
    ├── Button | TopNavBrandedActionPill  (optional CTA)
    ├── Tooltip → IconButton              (utilities, emphasis="subtle" on primary variant)
    └── Menu → Avatar → MenuOverlay
        ├── MenuHeader
        ├── profile row (Avatar + Text)
        └── MenuItem…
```

### TopNav structure (mobile)

Three **direct children** of `TopNav` (same CSS grid as desktop — do not use `TopNavBrand` / `TopNavContent` / `TopNavActions` wrappers on mobile):

```
TopNav
├── Box (start)     IconButton menu + logo
├── Box (center)    empty spacer
└── Box (end)       compact actions row (same Menu / Button / IconButton cluster)
```

### Shell components (outside TopNav)

These are not rendered inside `TopNav` but are part of the full **App Shell TopNav** experience:

- **SideNav** — drawer on mobile (`isOpen` / `onDismiss`); pinned or collapsed L1 rail on desktop.
- **App shell layout** — app-owned layout matching KlearNow geometry (56px header, 8px rail inset, main panel radii). Reference: `packages/compass/src/components/SideNav/docs/dashboardLayoutShell.tsx` (`AppShellLayout`).

### Workspace structure (list page with Table)

```
Box (padding, overflow)
├── Heading + Text (page header)
└── Table
    ├── TableHeader → TableHeaderRow → TableHeaderCell…
    └── TableBody → TableRow (item) → TableCell…
```

## Layout anatomy

`TopNav` renders a CSS grid: **`auto | minmax(0, 1fr) | auto`**. Always supply three regions (explicit subcomponents on desktop, or three sibling nodes on mobile).

```
Desktop (single-app shell — typical KlearNow)
┌─────────────────────────────────────────────────────────────┐
│  TopNavBrand (logo)  │  TopNavContent (empty or TabNav)  │  TopNavActions │
└─────────────────────────────────────────────────────────────┘

Mobile (SideNav in drawer)
┌─────────────────────────────────────────────────────────────┐
│  [menu] + logo       │  (spacer)                         │  actions       │
└─────────────────────────────────────────────────────────────┘
```

| Region | Desktop | Mobile |
|--------|---------|--------|
| Start | `TopNavBrand` — product logo | Menu `IconButton` + logo (opens SideNav drawer) |
| Center | `TopNavContent` — optional `TabNav` for multi-product; **empty** when SideNav owns IA | Empty `Box` (grid spacer) |
| End | `TopNavActions` — CTA, utilities, profile | Same actions, compact sizes |

## Variants

| `TopNav` `variant` | Background token | When to use |
|--------------------|------------------|-------------|
| `primary` (KlearNow default) | `surface.background.primary.intense` | Full app shell; page background matches TopNav on the primary frame |
| `neutral` | `interactive.background.staticBlack.default` | Legacy / multi-product black bar |

On `primary`, utility `IconButton`s in the actions cluster should use `emphasis="subtle"` so they remain visible on the brand bar.

## UI principles

1. **Sticky header** — `TopNav` is `position: sticky; top: 0`. Do not scroll the bar away.
2. **Dark chrome only inside TopNav** — `TopNav` forces `colorScheme="dark"` for children. Workspace content uses the normal page theme.
3. **SideNav owns hierarchy** — For single-app shells, leave `TopNavContent` empty; do not duplicate L1 links in TabNav.
4. **One shell geometry** — Pair with `AppShellLayout`: 56px TopNav, 8px rail inset, main panel with top-right / bottom radii (no top-left radius on main at the SideNav seam).
5. **Consumer-owned routing** — Active states for `TabNav` / links are not built into `TopNav`; use React Router (`useLocation`, `matchPath`) in the app.

## Reference implementation (Storybook)

| Story | What to verify |
|-------|----------------|
| **SideNav → KlearNow App Shell** | Full shell + **Table** on `/dashboard/transactions/*` |
| **TopNav → Full Example** | TopNav + SideNav + workspace demo list |
| **TopNav → Minimal** | TopNav-only shell |

Open **KlearNow App Shell** with initial route `/dashboard/transactions/active` to see the workspace **Table** pattern.

## Example

```tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  TopNav,
  TopNavBrand,
  TopNavContent,
  TopNavActions,
  TabNav,
  TabNavItems,
  TabNavItem,
  Box,
  Button,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuHeader,
  MenuItem,
  MenuOverlay,
  Text,
  SideNav,
  SideNavBody,
  SideNavLink,
  MenuIcon,
  ActivityIcon,
  HomeIcon,
} from '@klearnow/compass/components';

/** Single-app shell: empty TopNavContent, SideNav for IA. */
export function AppShellTopNavDesktop({ variant = 'primary' }: { variant?: 'primary' | 'neutral' }) {
  const emphasis = variant === 'primary' ? 'subtle' : undefined;

  return (
    <TopNav variant={variant}>
      <TopNavBrand>{/* app logo */}</TopNavBrand>
      <TopNavContent>{null}</TopNavContent>
      <TopNavActions>
        <Button variant="primary" size="medium">
          Klear Agent
        </Button>
        <Tooltip content="View Ecosystem Health">
          <IconButton
            icon={ActivityIcon}
            accessibilityLabel="View Ecosystem Health"
            isHighlighted
            emphasis={emphasis}
          />
        </Tooltip>
        <Menu openInteraction="click">
          <Avatar size="small" name="Jordan Brooks" />
          <MenuOverlay>
            <MenuHeader title="Profile" />
            <MenuItem>
              <Text>Logout</Text>
            </MenuItem>
          </MenuOverlay>
        </Menu>
      </TopNavActions>
    </TopNav>
  );
}

/** Mobile: three TopNav children — not TopNavBrand / Content / Actions wrappers. */
export function AppShellTopNavMobile({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <TopNav variant="primary">
      <Box display="flex" alignItems="center" gap="spacing.2">
        <IconButton
          icon={MenuIcon}
          variant="tertiary"
          emphasis="subtle"
          accessibilityLabel="Open main menu"
          onClick={onOpenMenu}
        />
        {/* logo */}
      </Box>
      <Box />
      <Box display="flex" alignItems="center">{/* compact actions */}</Box>
    </TopNav>
  );
}

/** Multi-product: TabNav in TopNavContent (optional variant of this pattern). */
export function AppShellTopNavMultiProduct() {
  const location = useLocation();

  return (
    <TopNav variant="neutral">
      <TopNavBrand>{/* logo */}</TopNavBrand>
      <TopNavContent>
        <TabNav items={[{ title: 'Home', href: '/home', icon: HomeIcon }]}>
          {({ items }) => (
            <TabNavItems>
              {items.map((item) => (
                <TabNavItem
                  key={item.title}
                  as={Link}
                  title={item.title}
                  href={item.href}
                  icon={item.icon}
                  isActive={location.pathname === item.href}
                />
              ))}
            </TabNavItems>
          )}
        </TabNav>
      </TopNavContent>
      <TopNavActions>{/* utilities + profile */}</TopNavActions>
    </TopNav>
  );
}

export function AppShellPage() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const isMobile = false; // from useBreakpoint in real apps

  return (
    <>
      {isMobile ? (
        <AppShellTopNavMobile onOpenMenu={() => setIsSideBarOpen(true)} />
      ) : (
        <AppShellTopNavDesktop />
      )}
      <SideNav isOpen={isSideBarOpen} onDismiss={() => setIsSideBarOpen(false)}>
        <SideNavBody>
          <SideNavLink icon={HomeIcon} title="Dashboard" href="/dashboard" as={Link} />
        </SideNavBody>
      </SideNav>
      {/* main workspace */}
    </>
  );
}
```

## Do

- Use three slots (brand, content, actions) on desktop; three grid cells on mobile.
- Match `TopNav` `variant` to the primary frame background when using `AppShellLayout`.
- Open mobile SideNav from the menu button in the start cell.
- Keep actions to a single horizontal row (CTA + a few icon actions + profile).

## Don't

- Don't put L1 SideNav links in TopNav for single-app KlearNow shells.
- Don't override TopNav internal theme — children inherit dark chrome automatically.
- Don't use BottomNav as a substitute for this header on desktop dashboards.
- Don't nest multiple sticky headers below TopNav without a clear page header pattern.

## Related patterns

- **Dashboard Template** — full shell including workspace sections and routing
- **ListView** — Table with filters, search, and pagination in the workspace
- **Settings** — TopNav + SideNav with TabNav in content for multi-area settings
