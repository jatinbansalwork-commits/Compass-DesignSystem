import React from 'react';
import styled, { type CSSObject } from 'styled-components';
import { SideNavContext } from './SideNavContext';
import {
  classes,
  COLLAPSED_L1_LINK_WIDTH,
  COLLAPSED_L1_ROW_MARGIN_Y,
  COLLAPSED_L1_WIDTH,
  HOVER_AGAIN_DELAY,
  L1_EXIT_HOVER_DELAY,
  NAV_ITEM_HEIGHT,
  SKIP_NAV_ID,
  TRANSITION_CLEANUP_DELAY,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
} from './tokens';
import type { SideNavContextType, SideNavProps } from './types';
import type { CompassElementRef } from '~utils/types';
import { size as sizeTokens } from '~tokens/global';
import type { Theme } from '~components/CompassProvider';
import { makeBorderSize, makeMotionTime, makeSize, makeSpace } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useIsMobile } from '~utils/useIsMobile';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { Drawer, DrawerBody, DrawerHeader } from '~components/Drawer';
import { SkipNavContent, SkipNavLink } from '~components/SkipNav/SkipNav';

const {
  COLLAPSED,
  SHOW_WHEN_COLLAPSED,
  HIDE_WHEN_COLLAPSED,
  TRANSITIONING,
  L1_ITEM_WRAPPER,
  STYLED_NAV_LINK,
} = classes;

const MobileL1Container = styled(BaseBox)(() => {
  return {
    [`.${SHOW_WHEN_COLLAPSED}`]: {
      display: 'none',
    },
  };
});

/** Icon-only rail: center L1 rows and remove hidden labels from layout (pin / `isExpanded` collapse). */
const getCollapsedL1RailInteractionStyles = (theme: Theme): Record<string, unknown> => {
  const rowMarginY = makeSize(COLLAPSED_L1_ROW_MARGIN_Y);

  return {
    [`& > .${L1_ITEM_WRAPPER}`]: {
      padding: makeSpace(theme.spacing[0]),
    },
    [`&:not(.${TRANSITIONING}) .${STYLED_NAV_LINK}`]: {
      boxSizing: 'border-box',
      width: COLLAPSED_L1_LINK_WIDTH,
      height: makeSize(NAV_ITEM_HEIGHT),
      minHeight: makeSize(NAV_ITEM_HEIGHT),
      margin: `${rowMarginY} auto`,
      padding: makeSpace(theme.spacing[0]),
      justifyContent: 'center',
      alignItems: 'center',
    },
    [`&:not(.${TRANSITIONING}) .${STYLED_NAV_LINK} > div:first-of-type`]: {
      width: 'auto',
    },
    [`&:not(.${TRANSITIONING}) .${STYLED_NAV_LINK} > div:first-of-type > div:first-of-type`]: {
      justifyContent: 'center',
      width: 'auto',
      gap: makeSpace(theme.spacing[0]),
    },
    [`&:not(.${TRANSITIONING}) .${L1_ITEM_WRAPPER} button`]: {
      boxSizing: 'border-box',
      width: COLLAPSED_L1_LINK_WIDTH,
      height: makeSize(NAV_ITEM_HEIGHT),
      minHeight: makeSize(NAV_ITEM_HEIGHT),
      margin: `${rowMarginY} auto`,
      padding: makeSpace(theme.spacing[0]),
    },
    [`&:not(.${TRANSITIONING}) .${HIDE_WHEN_COLLAPSED}`]: {
      display: 'none',
    },
    [`&:not(.${TRANSITIONING}) .${SHOW_WHEN_COLLAPSED}`]: {
      display: 'initial',
    },
  };
};

const StyledL1Menu = styled(BaseBox)<{ $isSideNavExpandable: boolean }>((props): CSSObject => {
  const quick = makeMotionTime(props.theme.motion.duration.quick);
  const xmoderate = makeMotionTime(props.theme.motion.duration.xmoderate);
  const easing = props.theme.motion.easing;

  const l1Expand = `width ${xmoderate} ${easing.entrance}`;
  const l1Collapse = `width ${quick} ${easing.exit}`;

  const collapsedL1RailStyles = getCollapsedL1RailInteractionStyles(props.theme);

  const textVisibilityProps = props.$isSideNavExpandable
    ? {
        [`&.${COLLAPSED}`]: collapsedL1RailStyles,
      }
    : {
        [`.${SHOW_WHEN_COLLAPSED}`]: {
          display: 'none',
        },
        [`&.${COLLAPSED}`]: {
          width: makeSize(COLLAPSED_L1_WIDTH),
          transition: l1Collapse,
          ...collapsedL1RailStyles,
        },
      };

  return {
    width: '100%',
    // the overall sidenav expands and collapses in this case. No need transition here
    transition: props.$isSideNavExpandable ? 'none' : l1Expand,
    [`& > .${L1_ITEM_WRAPPER}`]: {
      padding: makeSpace(props.theme.spacing[2]),
    },
    ...textVisibilityProps,
  } as unknown as CSSObject;
});

const StyledSideNavContainer = styled(BaseBox)<{
  $isSideNavExpandable: boolean;
  $suppressWidthTransition: boolean;
}>((props) => {
  const quick = makeMotionTime(props.theme.motion.duration.quick);
  const xmoderate = makeMotionTime(props.theme.motion.duration.xmoderate);
  const easing = props.theme.motion.easing;

  const sideNavExpand = `width ${xmoderate} ${easing.entrance}`;
  const sideNavCollapse = `width ${quick} ${easing.exit}`;

  if (!props.$isSideNavExpandable) {
    return {};
  }

  const collapsedL1RailStyles = getCollapsedL1RailInteractionStyles(props.theme);

  const widthTransition = props.$suppressWidthTransition ? 'none' : sideNavExpand;

  return {
    transition: widthTransition,
    [`&.${COLLAPSED}`]: {
      width: makeSize(COLLAPSED_L1_WIDTH),
      transition: props.$suppressWidthTransition ? 'none' : sideNavCollapse,
      ...collapsedL1RailStyles,
    },
    [`.${SHOW_WHEN_COLLAPSED}`]: {
      opacity: '0',
      pointerEvents: 'none',
      transition: `opacity ${quick} ${easing.exit}`,
    },
    [`.${HIDE_WHEN_COLLAPSED}`]: {
      opacity: '1',
      pointerEvents: 'auto',
      transition: `opacity ${quick} ${easing.entrance}`,
    },
  };
});

const StyledL2PortalContainer = styled(BaseBox)(() => {
  return {
    // This ensures that the portal node has 100% height when it has items
    '& > div:not(:empty)': {
      height: '100%',
    },
  };
});

const getL1MenuClassName = ({
  isL1Collapsed,
  isL1Hovered,
  isTransitioning,
}: {
  isL1Collapsed: boolean;
  isL1Hovered: boolean;
  isTransitioning: boolean;
}): string => {
  const isMenuCollapsed = isL1Collapsed && !isL1Hovered;

  if (isMenuCollapsed) {
    if (isTransitioning) {
      return `${COLLAPSED} ${TRANSITIONING}`;
    }

    return COLLAPSED;
  }

  return '';
};

const BannerContainer = styled(BaseBox)((props) => {
  return {
    '&:not(:empty)': {
      borderBottom: makeBorderSize(props.theme.border.width.thin),
      borderBottomStyle: 'solid',
      borderBottomColor: props.theme.colors.surface.border.gray.muted,
      borderRight: makeBorderSize(props.theme.border.width.thin),
      borderRightStyle: 'solid',
      borderRightColor: props.theme.colors.surface.border.gray.muted,
      padding: makeSpace(props.theme.spacing[3]),
      maxHeight: makeSize(sizeTokens['100']),
      width: '100%',
    },
  };
});

/**
 * ### SideNav component
 *
 * The side navigation is positioned along the left side of the screen that provides quick access to different sections or functionalities of the application.
 *
 * ---
 *
 * #### Usage
 *
 * SideNav requires handling active state with React Router, Checkout Usage with React Router v6 at - [SideNav Documentation](https://design.klearnow.com/?path=/docs/components-sidenav--docs)
 *
 */
const _SideNav = (
  {
    children,
    isOpen,
    onDismiss,
    onVisibleLevelChange,
    onExpandChange,
    onExpandTransitionEnd,
    banner,
    backgroundColor = 'surface.background.gray.moderate',
    testID,
    isExpanded: _isExpanded,
    isRailPeeking: _isRailPeeking,
    onRailPeekChange,
    l2Variant = 'flyout',
    l3Variant = 'flyout',
    ...rest
  }: SideNavProps,
  ref: React.Ref<CompassElementRef>,
): React.ReactElement => {
  const l2PortalContainerRef = React.useRef(null);
  const l3PortalContainerRef = React.useRef<HTMLDivElement>(null);
  const l1ContainerRef = React.useRef<HTMLDivElement>(null);
  const timeoutIdsRef = React.useRef<NodeJS.Timeout[]>([]);
  const mouseOverTimeoutRef = React.useRef<NodeJS.Timeout>();
  const prevIsSideNavCollapsedRef = React.useRef<boolean>();
  const skipNextControlledExpandTransitionRef = React.useRef(false);
  const [suppressWidthTransition, setSuppressWidthTransition] = React.useState(false);
  const [isL1Collapsed, setIsL1Collapsed] = React.useState(false);
  const [isMobileL2Open, setIsMobileL2Open] = React.useState(false);
  const [isL1Hovered, setIsL1Hovered] = React.useState(false);
  const [internalRailPeeking, setInternalRailPeeking] = React.useState(false);
  const [isHoverAgainEnabled, setIsHoverAgainEnabled] = React.useState(true);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [l2DrawerTitle, setL2DrawerTitle] = React.useState('');

  const isMobile = useIsMobile();
  const isSideNavCollapsed = _isExpanded === false;
  const isForceExpanded = _isExpanded === true;
  const isRailPeekingControlled = _isRailPeeking !== undefined;
  const isRailPeeking = isRailPeekingControlled ? _isRailPeeking : internalRailPeeking;
  const isRailVisuallyCollapsed = isSideNavCollapsed && !isRailPeeking;

  const setRailPeeking = React.useCallback(
    (isPeeking: boolean): void => {
      if (!isRailPeekingControlled) {
        setInternalRailPeeking(isPeeking);
      }
      onRailPeekChange?.({ isPeeking });
    },
    [isRailPeekingControlled, onRailPeekChange],
  );

  const openRailPeek = React.useCallback((): void => {
    if (isMobile || !isSideNavCollapsed) {
      return;
    }
    if (mouseOverTimeoutRef.current) {
      clearTimeout(mouseOverTimeoutRef.current);
      mouseOverTimeoutRef.current = undefined;
    }
    setRailPeeking(true);
  }, [isMobile, isSideNavCollapsed, setRailPeeking]);

  const closeRailPeek = React.useCallback((): void => {
    if (isMobile || !isSideNavCollapsed || !isRailPeeking) {
      return;
    }
    setRailPeeking(false);
  }, [isMobile, isRailPeeking, isSideNavCollapsed, setRailPeeking]);

  const scheduleCloseRailPeek = React.useCallback((): void => {
    if (isMobile || !isSideNavCollapsed) {
      return;
    }
    if (mouseOverTimeoutRef.current) {
      clearTimeout(mouseOverTimeoutRef.current);
    }
    mouseOverTimeoutRef.current = setTimeout(() => {
      setRailPeeking(false);
    }, L1_EXIT_HOVER_DELAY);
  }, [isMobile, isSideNavCollapsed, setRailPeeking]);

  const cancelScheduledRailPeekClose = React.useCallback((): void => {
    if (mouseOverTimeoutRef.current) {
      clearTimeout(mouseOverTimeoutRef.current);
      mouseOverTimeoutRef.current = undefined;
    }
  }, []);

  const notifyPinFromPeek = React.useCallback((): void => {
    skipNextControlledExpandTransitionRef.current = true;
    setSuppressWidthTransition(true);
    cancelScheduledRailPeekClose();
  }, [cancelScheduledRailPeekClose]);

  const effectiveIsL1Collapsed = isMobile
    ? isMobileL2Open
    : isSideNavCollapsed || (isForceExpanded ? false : isL1Collapsed);

  const effectiveIsL1Hovered = isSideNavCollapsed ? isRailPeeking : isL1Hovered;
  const sideNavWidth = isRailVisuallyCollapsed
    ? makeSize(COLLAPSED_L1_WIDTH)
    : {
        base: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
        xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
      };

  const closeMobileNav = (): void => {
    if (isMobile) {
      setIsMobileL2Open(false);
      onDismiss?.();
      onVisibleLevelChange?.({ visibleLevel: 0 });
    }
  };

  const cleanupTransition = React.useCallback((): void => {
    const clearTransitionTimeout = setTimeout(() => {
      setIsTransitioning((isCurrentlyTransitioning) =>
        isCurrentlyTransitioning ? false : isCurrentlyTransitioning,
      );
    }, TRANSITION_CLEANUP_DELAY);
    timeoutIdsRef.current.push(clearTransitionTimeout);
  }, []);

  const startL1Transition = React.useCallback((): void => {
    setIsTransitioning(true);
    cleanupTransition();
  }, [cleanupTransition]);

  const collapseL1 = (title: string): void => {
    if (isMobile) {
      setL2DrawerTitle(title);
      setIsMobileL2Open(true);
      onVisibleLevelChange?.({ visibleLevel: 2 });
      return;
    }

    if (l2Variant === 'flyout') {
      onVisibleLevelChange?.({ visibleLevel: 2 });
      return;
    }

    if (isForceExpanded) {
      onVisibleLevelChange?.({ visibleLevel: 2 });
      return;
    }

    if (!isL1Collapsed) {
      setIsL1Collapsed(true);
      onVisibleLevelChange?.({ visibleLevel: 2 });
    }
  };

  const expandL1 = (): void => {
    if (isMobile) {
      setIsMobileL2Open(false);
      onVisibleLevelChange?.({ visibleLevel: 1 });
      return;
    }

    if (isSideNavCollapsed) {
      openRailPeek();
      return;
    }

    // Ensures that if Normal L1 item is clicked, the L1 stays expanded
    if (isL1Collapsed) {
      setIsL1Collapsed(false);
      // We want to avoid calling onVisibleLevelChange twice when L1 is hovered and then item on L1 is selected
      if (!isL1Hovered) {
        onVisibleLevelChange?.({ visibleLevel: 1 });
      }
    }
  };

  /**
   * Handles L1 -> L2 menu changes based on active item
   */
  const onLinkActiveChange: SideNavContextType['onLinkActiveChange'] = (args) => {
    const isL1ItemActive = args.level === 1 && args.isActive;

    if (isL1ItemActive) {
      if (args.isL2Trigger) {
        collapseL1(args.title);

        const skipL1CollapseTransition = l2Variant === 'flyout' && !isMobile;

        // `args.isFirstRender` checks if the item that triggered this change, triggered it during first render or during subsequent change
        if (!args.isFirstRender && !skipL1CollapseTransition) {
          startL1Transition();
          setIsL1Hovered(false);
          setIsHoverAgainEnabled(false);
          // For some delay, we disable hover to expand behaviour to avoid buggy flicker when cursor is on L1 while its trying to close
          const hoverAgainTimeout = setTimeout(() => {
            setIsHoverAgainEnabled(true);
          }, HOVER_AGAIN_DELAY);
          timeoutIdsRef.current.push(hoverAgainTimeout);
        }
      } else {
        // Click on normal L1 Item
        expandL1();
      }
    }
  };

  const contextValue = React.useMemo(
    () => ({
      l2PortalContainerRef,
      l3PortalContainerRef,
      l2Variant,
      l3Variant,
      isForceExpanded,
      onLinkActiveChange,
      closeMobileNav,
      openRailPeek,
      closeRailPeek,
      cancelScheduledRailPeekClose,
      notifyPinFromPeek,
      isL1Collapsed: effectiveIsL1Collapsed,
      setIsL1Collapsed,
      isL1Hovered: effectiveIsL1Hovered,
      isSideNavCollapsed,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      effectiveIsL1Collapsed,
      effectiveIsL1Hovered,
      isSideNavCollapsed,
      isForceExpanded,
      l2Variant,
      l3Variant,
      isMobile,
    ],
  );

  React.useEffect(() => {
    return () => {
      for (const timeoutId of timeoutIdsRef.current) {
        clearTimeout(timeoutId);
      }
      timeoutIdsRef.current = [];
    };
  }, []);

  React.useEffect(() => {
    if (isForceExpanded && isRailPeeking) {
      setRailPeeking(false);
    }
  }, [isForceExpanded, isRailPeeking, setRailPeeking]);

  React.useEffect(() => {
    const prevIsSideNavCollapsed = prevIsSideNavCollapsedRef.current;
    prevIsSideNavCollapsedRef.current = isSideNavCollapsed;

    if (isMobile || prevIsSideNavCollapsed === undefined) {
      return;
    }

    if (prevIsSideNavCollapsed !== isSideNavCollapsed) {
      const isControlledExpand = prevIsSideNavCollapsed && !isSideNavCollapsed;
      if (isControlledExpand && skipNextControlledExpandTransitionRef.current) {
        skipNextControlledExpandTransitionRef.current = false;
        onExpandChange?.({ isExpanded: true });
        requestAnimationFrame(() => {
          setSuppressWidthTransition(false);
        });
        return;
      }
      startL1Transition();
      onExpandChange?.({ isExpanded: !isSideNavCollapsed });
    }
  }, [isMobile, isSideNavCollapsed, onExpandChange, startL1Transition]);

  return (
    <SideNavContext.Provider value={contextValue}>
      {isMobile && onDismiss ? (
        <>
          {/* L1 */}
          <Drawer isOpen={isOpen ?? false} onDismiss={closeMobileNav}>
            <DrawerHeader title="Main Menu" />
            <DrawerBody>
              <MobileL1Container
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                className="mobile-l1-container"
                height="100%"
                {...metaAttribute({
                  name: MetaConstants.SideNav,
                  testID,
                })}
              >
                {children}
              </MobileL1Container>
            </DrawerBody>
          </Drawer>
          {/* L2 */}
          <Drawer isOpen={isMobileL2Open} onDismiss={() => expandL1()} isLazy={false}>
            <DrawerHeader title={l2DrawerTitle} />
            <DrawerBody>
              <BaseBox ref={l2PortalContainerRef} />
            </DrawerBody>
          </Drawer>
        </>
      ) : (
        <StyledSideNavContainer
          $isSideNavExpandable={typeof _isExpanded !== 'undefined'}
          $suppressWidthTransition={suppressWidthTransition}
          ref={ref as never}
          className={isRailVisuallyCollapsed ? COLLAPSED : ''}
          position="fixed"
          backgroundColor={backgroundColor}
          height="100%"
          top="spacing.0"
          left="spacing.0"
          display={{ base: 'none', m: 'flex' }}
          flexDirection="column"
          width={sideNavWidth}
          as="nav"
          {...metaAttribute({
            name: MetaConstants.SideNav,
            testID,
          })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget || e.propertyName !== 'width' || isMobile) {
              return;
            }

            onExpandTransitionEnd?.({
              isExpanded: !isRailVisuallyCollapsed,
            });
          }}
        >
          {banner ? <BannerContainer>{banner}</BannerContainer> : null}
          <BaseBox position="relative" display="block" flex="1" width="100%">
            <StyledL2PortalContainer
              position="absolute"
              display={isSideNavCollapsed || l2Variant === 'flyout' ? 'none' : 'block'}
              backgroundColor={backgroundColor}
              height="100%"
              width="100%"
              top="spacing.0"
              left="spacing.0"
              id="blade-sidenav-l2"
              borderRightWidth="thin"
              borderRightColor="surface.border.gray.muted"
              ref={l2PortalContainerRef}
            />
            <StyledL1Menu
              ref={l1ContainerRef}
              id="blade-sidenav-l1"
              className={getL1MenuClassName({
                isL1Collapsed: effectiveIsL1Collapsed,
                isL1Hovered: effectiveIsL1Hovered,
                isTransitioning,
              })}
              $isSideNavExpandable={typeof _isExpanded !== 'undefined'}
              position="absolute"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              backgroundColor={backgroundColor}
              height="100%"
              overflow="hidden"
              top="spacing.0"
              left="spacing.0"
              borderRightWidth="thin"
              borderRightColor="surface.border.gray.muted"
              onTransitionEnd={(e) => {
                // This check ensures transitioning is set to false only when its true
                // And only the l1Container element's transitions are considered and other transitions of l1 expand or child elements are ignored
                if (isTransitioning && l1ContainerRef.current === e.target) {
                  setIsTransitioning(false);
                }
              }}
              // Hmm you might be wondering, why is `onMouseOver` paired with `onMouseLeave`? A sane person would pair `onMouseOver` with `onMouseOut`, and `onMouseEnter` with `onMouseLeave`
              // since they are logical equivalents of each other. So why don't we do that? Hold tight, you're in for a ride ☕️.
              //
              // 1. In an ideal scenario, we would put `onMouseEnter` and `onMouseLeave` here and expect things to work.
              // 2. The L2 menu of our SideNav is React Portalled out of the L1 child
              // 3. React considers its own children as true children for JS events and not DOM children (Checkout React Portal Caveats - https://react.dev/reference/react-dom/createPortal#caveats)
              // 3. In the next ideal scenario, we would put `e.stopPropagation` on child component of portal like React recommends, except mouseenter, mouseleave events don't propagate at all (https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event#usage_notes)
              // 4. So `onMouseEnter` gets triggered on L2 enter. But we don't want to open L1 menu on L2 hover
              // 5. Thus we use `onMouseOver` for hover part and call e.stopPropagation in portal child (SideNavLevel).
              // 6. But in case of unhover/leave, we don't want to trigger mouseOut for all child components individually. We want 1 hover out of L1 menu. Thus we use `onMouseLeave`
              onMouseOver={() => {
                if (!isMobile && isSideNavCollapsed) {
                  openRailPeek();
                  return;
                }
                if (mouseOverTimeoutRef.current) {
                  clearTimeout(mouseOverTimeoutRef.current);
                }
                if (isL1Collapsed && isHoverAgainEnabled && !isL1Hovered) {
                  setIsL1Hovered(true);
                  onVisibleLevelChange?.({ visibleLevel: 1 });
                }
              }}
              onMouseLeave={() => {
                if (!isMobile && isSideNavCollapsed) {
                  scheduleCloseRailPeek();
                  return;
                }
                if (isL1Collapsed && isL1Hovered) {
                  mouseOverTimeoutRef.current = setTimeout(() => {
                    setIsL1Hovered(false);
                    startL1Transition();
                    onVisibleLevelChange?.({ visibleLevel: 2 });
                  }, L1_EXIT_HOVER_DELAY);
                }
                // If L1 is collapsed and not hovered we want to change visible level to 2
                // This state/edgecase happens when user clicks on a nested nav and it collapses the L1 causing isL1Hovered to be false
                if (isL1Collapsed && !isL1Hovered) {
                  onVisibleLevelChange?.({ visibleLevel: 2 });
                }
              }}
            >
              <SkipNavLink id={SKIP_NAV_ID} _hasBackground={true} />
              {children}
            </StyledL1Menu>
            <SkipNavContent id={SKIP_NAV_ID} />
          </BaseBox>
        </StyledSideNavContainer>
      )}
    </SideNavContext.Provider>
  );
};

const SideNav = React.forwardRef(_SideNav);

export { SideNav };
