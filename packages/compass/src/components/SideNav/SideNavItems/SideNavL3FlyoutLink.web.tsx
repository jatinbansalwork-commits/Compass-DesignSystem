import React from 'react';
import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  offset,
  useFloating,
} from '@floating-ui/react';
import { useSideNav } from '../SideNavContext';
import { classes, FLYOUT_INTENT_DELAY, FLYOUT_OVERLAP, getSideNavFlyoutPanelProps } from '../tokens';
import type { SideNavLinkProps } from '../types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';
import BaseBox from '~components/Box/BaseBox';
import { ChevronRightIcon } from '~components/Icons';
import { makeAccessible } from '~utils/makeAccessible';
import { NavLinkIconTitle, StyledNavLinkContainer } from './SideNavLinkParts.web';

const { STYLED_NAV_LINK } = classes;

type SideNavL3FlyoutLinkProps = SideNavLinkProps & {
  currentLevel: number;
  isFirstRender: boolean;
};

const SideNavL3FlyoutLink = ({
  title,
  description,
  href,
  children,
  titleSuffix,
  trailing,
  isActive,
  icon,
  tooltip,
  as,
  target,
  onClick,
  currentLevel,
  isFirstRender,
  ...rest
}: SideNavL3FlyoutLinkProps): React.ReactElement => {
  const {
    l3PortalContainerRef,
    onLinkActiveChange,
    l2Variant,
    isL1Collapsed,
    isForceExpanded,
    openRailPeek,
  } = useSideNav();

  const [isHoverOpen, setIsHoverOpen] = React.useState(false);
  const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const triggerRef = React.useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const isL2PanelVisible =
    l2Variant === 'flyout' ? true : Boolean(isL1Collapsed || isForceExpanded);
  const isFlyoutOpen = Boolean(isActive || isHoverOpen) && isL2PanelVisible;

  const clearFlyoutTimers = (): void => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = undefined;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = undefined;
    }
  };

  React.useEffect(() => {
    return () => {
      clearFlyoutTimers();
    };
  }, []);

  React.useEffect(() => {
    onLinkActiveChange?.({
      level: currentLevel,
      title,
      isActive: Boolean(isActive),
      isL2Trigger: false,
      isFirstRender,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const scheduleOpen = (): void => {
    clearFlyoutTimers();
    openTimeoutRef.current = setTimeout(() => {
      setIsHoverOpen(true);
    }, FLYOUT_INTENT_DELAY);
  };

  const scheduleClose = (): void => {
    if (isActive) {
      return;
    }
    clearFlyoutTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setIsHoverOpen(false);
    }, FLYOUT_INTENT_DELAY);
  };

  const closeHoverFlyout = (): void => {
    clearFlyoutTimers();
    setIsHoverOpen(false);
  };

  const { refs, floatingStyles, context } = useFloating({
    open: isFlyoutOpen,
    placement: 'right-start',
    middleware: [offset({ mainAxis: -FLYOUT_OVERLAP })],
    whileElementsMounted: autoUpdate,
  });

  const setReference = (node: HTMLAnchorElement | HTMLButtonElement | null): void => {
    (triggerRef as React.MutableRefObject<HTMLAnchorElement | HTMLButtonElement | null>).current =
      node;
    refs.setReference(node);
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      clearFlyoutTimers();
      setIsHoverOpen(true);
      requestAnimationFrame(() => {
        const panel = l3PortalContainerRef?.current?.querySelector<HTMLElement>(
          '[data-sidenav-l3-flyout]',
        );
        const firstRow = panel?.querySelector<HTMLElement>('[data-sidenav-row]');
        firstRow?.focus();
      });
    }
  };

  const handleFlyoutKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      closeHoverFlyout();
      triggerRef.current?.focus();
      return;
    }

    const panel = event.currentTarget;
    const target = event.target as HTMLElement;
    const row = target.closest<HTMLElement>('[data-sidenav-row]');
    if (!row) {
      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    event.preventDefault();
    const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-sidenav-row]'));
    const index = items.indexOf(row);
    if (event.key === 'ArrowDown') {
      items[Math.min(items.length - 1, index + 1)]?.focus();
      return;
    }
    if (index <= 0) {
      triggerRef.current?.focus();
      return;
    }
    items[index - 1]?.focus();
  };

  return (
    <>
      <StyledNavLinkContainer
        $hasDescription={Boolean(description)}
        $isL1Item={false}
        position="relative"
      >
        <TooltipifyComponent tooltip={tooltip}>
          <BaseBox
            className={STYLED_NAV_LINK}
            as={href ? as : 'button'}
            to={href}
            href={as ? undefined : href}
            target={target}
            ref={setReference}
            type={href ? undefined : 'button'}
            data-sidenav-branch=""
            data-sidenav-row=""
            onMouseOver={scheduleOpen}
            onMouseLeave={scheduleClose}
            onFocus={scheduleOpen}
            onBlur={scheduleClose}
            onKeyDown={handleTriggerKeyDown}
            onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.preventDefault();
              clearFlyoutTimers();
              setIsHoverOpen(true);
              openRailPeek?.();
              onClick?.(e);
            }}
            aria-current={isActive ? 'page' : undefined}
            {...makeAccessible({ expanded: isFlyoutOpen })}
            {...makeAnalyticsAttribute(rest)}
          >
            <NavLinkIconTitle
              icon={icon}
              title={title}
              description={description}
              isActive={isActive}
              isL1Item={false}
              titleSuffix={titleSuffix}
              trailing={
                <BaseBox display="flex" alignItems="center">
                  <ChevronRightIcon size="medium" color="currentColor" />
                </BaseBox>
              }
            />
          </BaseBox>
        </TooltipifyComponent>
        {trailing ? (
          <BaseBox position="absolute" top="spacing.0" right="spacing.2" height="100%" display="flex" alignItems="center">
            {trailing}
          </BaseBox>
        ) : null}
      </StyledNavLinkContainer>
      {children ? (
        <FloatingPortal root={l3PortalContainerRef?.current ?? undefined}>
          {isFlyoutOpen ? (
            <FloatingFocusManager modal={false} context={context} initialFocus={-1} returnFocus>
              <BaseBox
                ref={refs.setFloating}
                data-sidenav-l3-flyout=""
                style={floatingStyles}
                {...getSideNavFlyoutPanelProps()}
                borderWidth="none"
                zIndex={2}
                onKeyDown={handleFlyoutKeyDown}
                onMouseOver={() => {
                  clearFlyoutTimers();
                  openRailPeek?.();
                }}
                onMouseLeave={scheduleClose}
              >
                {children}
              </BaseBox>
            </FloatingFocusManager>
          ) : null}
        </FloatingPortal>
      ) : null}
    </>
  );
};

export { SideNavL3FlyoutLink };
