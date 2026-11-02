import React from 'react';
import styled from 'styled-components';
import { FloatingFocusManager, FloatingPortal, useFloating } from '@floating-ui/react';
import { NavLinkContext, useNavLink, useSideNav } from '../SideNavContext';
import { NAV_ITEM_HEIGHT } from '../tokens';
import type { SideNavLinkProps } from '../types';
import { SideNavL2FlyoutLink } from './SideNavL2FlyoutLink.web';
import { SideNavL3FlyoutLink } from './SideNavL3FlyoutLink.web';
import {
  HIDE_WHEN_COLLAPSED,
  NavLinkIconTitle,
  SHOW_ON_LINK_HOVER,
  STYLED_NAV_LINK,
  StyledNavLinkContainer,
} from './SideNavLinkParts.web';
import { makeBorderSize, makeSize, makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { throwCompassError } from '~utils/logger';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { TooltipifyComponent } from '~utils/TooltipifyComponent';
import { useFirstRender } from '~utils/useFirstRender';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useIsMobile } from '~utils/useIsMobile';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Collapsible, CollapsibleBody } from '~components/Collapsible';
import { useCollapsible } from '~components/Collapsible/CollapsibleContext';
import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '~components/Icons';

const L3Trigger = ({
  title,
  description,
  icon,
  as,
  href,
  target,
  titleSuffix,
  tooltip,
  onClick,
}: Pick<
  SideNavLinkProps,
  | 'title'
  | 'description'
  | 'icon'
  | 'as'
  | 'href'
  | 'titleSuffix'
  | 'tooltip'
  | 'target'
  | 'onClick'
>): React.ReactElement => {
  const { onExpandChange, isExpanded, collapsibleBodyId } = useCollapsible();

  const toggleCollapse = (e: React.MouseEvent): void => {
    onClick?.(e);
    onExpandChange(!isExpanded);
  };
  const iconProps = {
    size: 'medium',
    color: 'currentColor',
  } as const;

  return (
    <TooltipifyComponent tooltip={tooltip}>
      <StyledNavLinkContainer $hasDescription={Boolean(description)} $isL1Item={false}>
        <BaseBox
          className={STYLED_NAV_LINK}
          as={href ? as : 'button'}
          to={href}
          target={target}
          onClick={(e: React.MouseEvent) => toggleCollapse(e)}
          {...makeAccessible({ expanded: isExpanded, controls: collapsibleBodyId })}
        >
          <NavLinkIconTitle
            title={title}
            description={description}
            icon={icon}
            isL1Item={false}
            titleSuffix={titleSuffix}
            trailing={
              isExpanded ? <ChevronUpIcon {...iconProps} /> : <ChevronDownIcon {...iconProps} />
            }
          />
        </BaseBox>
      </StyledNavLinkContainer>
    </TooltipifyComponent>
  );
};

/**
 * This is the curved line that appears when you select L3 item
 */
const CurvedVerticalLine = styled(BaseBox)((props) => {
  const { colors, border, spacing } = props.theme;
  return {
    borderWidth: makeBorderSize(props.theme.border.width.thin),
    borderColor: `${colors.transparent} ${colors.transparent} ${colors.surface.border.gray.muted} ${colors.surface.border.gray.muted}`,
    borderStyle: 'solid',
    borderRadius: `${makeBorderSize(border.radius.none)} ${makeBorderSize(
      border.radius.none,
    )} ${makeBorderSize(border.radius.none)} ${makeBorderSize(border.radius.medium)}`,
    // We set veritical line infinitely tall (full size of screen) and then hide the overflowing part from top
    height: '100vh',
    position: 'absolute',
    // We want the active line to be positioned in the middle of item's height thus divide by 2
    top: `calc(-100vh + ${makeSize(NAV_ITEM_HEIGHT / 2)})`,
    width: makeSpace(spacing[3]),
    left: makeSpace(-spacing[3]),
  };
});

const SideNavLink = ({
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
  ...rest
}: SideNavLinkProps): React.ReactElement => {
  const {
    l2PortalContainerRef,
    onLinkActiveChange,
    closeMobileNav,
    isL1Collapsed,
    isSideNavCollapsed,
    isForceExpanded,
    l2Variant,
    l3Variant,
    setIsL1Collapsed,
    closeRailPeek,
  } = useSideNav();
  const isMobile = useIsMobile();
  const { level: _prevLevel } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  const isL2Trigger = Boolean(children) && currentLevel === 1;
  const isL3Trigger = Boolean(children) && currentLevel === 2;
  const useColumnL2 = l2Variant !== 'flyout' || isMobile;
  const useAccordionL3 = l3Variant !== 'flyout' || isMobile;

  if (__DEV__) {
    if (Boolean(children) && currentLevel >= 3) {
      throwCompassError({
        message:
          'SideNav only supports nesting upto L3 but L4 nesting was found. Check the nesting of your SideNavLevel items',
        moduleName: 'SideNavLink',
      });
    }

    if (currentLevel === 1 && Boolean(description)) {
      throwCompassError({
        message: 'Description is not supported for L1 items',
        moduleName: 'SideNavLink',
      });
    }
  }

  const isFirstRender = useFirstRender();

  const { refs, context } = useFloating({
    open: isActive,
  });

  useIsomorphicLayoutEffect(() => {
    onLinkActiveChange?.({
      level: currentLevel,
      title,
      isActive: Boolean(isActive),
      isL2Trigger,
      isFirstRender,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const shouldHideL1Item = currentLevel === 1 && !icon && isSideNavCollapsed;

  if (isL2Trigger && !useColumnL2) {
    return (
      <NavLinkContext.Provider value={{ level: currentLevel, title }}>
        <SideNavL2FlyoutLink
          title={title}
          description={description}
          href={href}
          children={children}
          titleSuffix={titleSuffix}
          trailing={trailing}
          isActive={isActive}
          icon={icon}
          tooltip={tooltip}
          as={as}
          target={target}
          onClick={onClick}
          currentLevel={currentLevel}
          isFirstRender={isFirstRender}
          {...rest}
        />
      </NavLinkContext.Provider>
    );
  }

  if (isL3Trigger && !useAccordionL3) {
    return (
      <NavLinkContext.Provider value={{ level: currentLevel, title }}>
        <SideNavL3FlyoutLink
          title={title}
          description={description}
          href={href}
          children={children}
          titleSuffix={titleSuffix}
          trailing={trailing}
          isActive={isActive}
          icon={icon}
          tooltip={tooltip}
          as={as}
          target={target}
          onClick={onClick}
          currentLevel={currentLevel}
          isFirstRender={isFirstRender}
          {...rest}
        />
      </NavLinkContext.Provider>
    );
  }

  return (
    <NavLinkContext.Provider value={{ level: currentLevel, title }}>
      {isL3Trigger ? (
        <Collapsible
          defaultIsExpanded={isActive}
          _dangerouslyDisableValidations={true}
          _shouldApplyWidthRestrictions={false}
        >
          <L3Trigger
            title={title}
            description={description}
            icon={icon}
            as={as}
            href={href}
            titleSuffix={titleSuffix}
            onClick={onClick}
          />
          <CollapsibleBody width="100%" _hasMargin={false}>
            <Box position="relative">{children}</Box>
          </CollapsibleBody>
        </Collapsible>
      ) : (
        <>
          <StyledNavLinkContainer
            $hasDescription={currentLevel !== 1 && Boolean(description)}
            $isL1Item={currentLevel === 1}
            position="relative"
          >
            <TooltipifyComponent tooltip={tooltip}>
              <BaseBox
                className={`${STYLED_NAV_LINK} ${shouldHideL1Item ? HIDE_WHEN_COLLAPSED : ''}`}
                as={as ?? 'a'}
                to={href}
                href={as ? undefined : href}
                target={target}
                ref={refs.setReference}
                onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                  // Close the mobile nav when item is clicked and its not trigger for next menu
                  if (!isL2Trigger) {
                    closeMobileNav?.();
                    closeRailPeek?.();
                  }

                  if (isActive) {
                    onLinkActiveChange?.({
                      level: currentLevel,
                      title,
                      isActive: Boolean(isActive),
                      isL2Trigger,
                      isFirstRender: false,
                    });
                  }

                  onClick?.(e);
                }}
                onFocus={(e: { target: HTMLDivElement }) => {
                  // FloatinFocusManager by default focusses on last clicked element when you move to different tab and come back to the original tab
                  // Which can make L1 to expand when tabs / windows are changed
                  // Adding focus-visible check ensures this behaviour of closing menus is only applicable when there is visible focus ring on it (while tabbing)
                  const hasFocusRing = e.target?.matches(':focus-visible');
                  if (isL1Collapsed && !isSideNavCollapsed && currentLevel === 1 && hasFocusRing) {
                    setIsL1Collapsed?.(false);
                  }
                }}
                aria-current={isActive ? 'page' : undefined}
                data-level={currentLevel}
                data-l2trigger={isL2Trigger}
                data-sidenav-row={currentLevel >= 2 ? '' : undefined}
                {...makeAnalyticsAttribute(rest)}
              >
                <NavLinkIconTitle
                  icon={icon}
                  title={title}
                  description={description}
                  isActive={isActive}
                  isL1Item={currentLevel === 1}
                  titleSuffix={titleSuffix}
                />
                {isL2Trigger ? (
                  <BaseBox className={HIDE_WHEN_COLLAPSED} display="flex" alignItems="center">
                    <ChevronRightIcon size="medium" color="currentColor" />
                  </BaseBox>
                ) : null}
              </BaseBox>
            </TooltipifyComponent>
            {trailing && !isL2Trigger ? (
              <BaseBox
                position="absolute"
                top="spacing.0"
                right="spacing.2"
                height="100%"
                display="flex"
                alignItems="center"
                className={`${HIDE_WHEN_COLLAPSED} ${SHOW_ON_LINK_HOVER}`}
              >
                {trailing}
              </BaseBox>
            ) : null}
            {currentLevel === 3 && isActive ? <CurvedVerticalLine /> : null}
          </StyledNavLinkContainer>
          {children ? (
            <FloatingPortal root={l2PortalContainerRef}>
              {isActive && (isL1Collapsed || isForceExpanded) ? (
                <FloatingFocusManager modal={false} context={context} initialFocus={-1} returnFocus>
                  <BaseBox ref={refs.setFloating} height="100%">
                    {children}
                  </BaseBox>
                </FloatingFocusManager>
              ) : null}
            </FloatingPortal>
          ) : null}
        </>
      )}
    </NavLinkContext.Provider>
  );
};

export { SideNavLink };
