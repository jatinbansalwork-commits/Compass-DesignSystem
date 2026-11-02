import React, { useState } from 'react';
import styled from 'styled-components';
import { ComponentIds } from './componentIds';
import { tableIcons, tableToolbar } from './tokens';
import { useTableRowContext, useTableDataContext } from './TableContext';
import type { TableToolbarProps, TableToolbarActionsProps, TableToolbarSearchProps } from './types';
import { SearchInput } from '~components/Input/SearchInput';
import { makeMotionTime, makeSize } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import getIn from '~utils/lodashButBetter/get';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Divider } from '~components/Divider';
import { Link } from '~components/Link';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/CompassProvider';
import { IconButton } from '~components/Button/IconButton';
import { SearchIcon } from '~components/Icons';

/**
 * TableToolbarActions is a component that is used to render actions in the TableToolbar.
 * It is a flex container that will render its children in a row on desktop and a column on mobile.
 *
 * Action buttons never shrink below their natural (single-line) width - `flexShrink={0}` here
 * means that once the toolbar runs out of horizontal room, the whole actions block wraps onto
 * its own line (the toolbar row itself is `flexWrap: wrap`) instead of individual buttons being
 * squeezed narrower than their label, which wraps that label onto two lines.
 *
 * Use `size="small"` buttons here so their height (32px) matches `TableToolbarSearch`'s - both
 * resolve to the same underlying size token when `size="small"`.
 * @param children - any react element
 * @param styledProps - accepts all of the styled props from Box
 */
const _TableToolbarActions = ({
  children,
  ...rest
}: TableToolbarActionsProps): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      flexWrap={onMobile ? 'wrap' : 'nowrap'}
      alignItems="center"
      gap={tableToolbar.actionsGap}
      flexShrink={0}
      justifyContent="flex-start"
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <BaseBox key={child.key ?? index} flexShrink={0}>
            {child}
          </BaseBox>
        ) : (
          child
        ),
      )}
    </BaseBox>
  );
};

const TableToolbarActions = assignWithoutSideEffects(_TableToolbarActions, {
  displayName: 'TableToolbarActions',
  componentId: ComponentIds.TableToolbarActions,
});

/**
 * TableToolbarSearch renders a search input wired to the Table's global filter state (see
 * `TableProps['globalFilterValue']`/`filterFunctions`). Place it as a `TableToolbar` child,
 * alongside `TableToolbarActions` if present.
 */
const _TableToolbarSearch = ({
  placeholder = 'Search',
  accessibilityLabel = 'Search table',
  variant = 'expanded',
  ...rest
}: TableToolbarSearchProps): React.ReactElement => {
  const { globalFilterValue, setGlobalFilterValue } = useTableDataContext();
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const isCollapsible = variant === 'collapsibleOnHover';
  const isExpanded =
    !isCollapsible || isHoverExpanded || Boolean(globalFilterValue?.trim());

  const searchInput = (
    <SearchInput
      size="small"
      isFullWidth
      value={globalFilterValue}
      onChange={({ value }) => setGlobalFilterValue(value ?? '')}
      placeholder={placeholder}
      accessibilityLabel={accessibilityLabel}
    />
  );

  if (isCollapsible && !isExpanded) {
    return (
      <BaseBox flexShrink={0} {...makeAnalyticsAttribute(rest)}>
        <IconButton
          size={tableIcons.control}
          icon={SearchIcon}
          accessibilityLabel={accessibilityLabel}
          onClick={() => setIsHoverExpanded(true)}
        />
      </BaseBox>
    );
  }

  return (
    <BaseBox
      flex={0}
      width={makeSize(
        isCollapsible ? tableToolbar.searchCollapsibleMaxWidth : tableToolbar.searchDefaultWidth,
      )}
      minWidth={makeSize(
        isCollapsible ? tableToolbar.searchCollapsibleMinWidth : tableToolbar.searchMinWidth,
      )}
      maxWidth={makeSize(
        isCollapsible ? tableToolbar.searchCollapsibleMaxWidth : tableToolbar.searchMaxWidth,
      )}
      flexShrink={0}
      onMouseEnter={isCollapsible ? () => setIsHoverExpanded(true) : undefined}
      onMouseLeave={
        isCollapsible
          ? () => {
              if (!globalFilterValue?.trim()) {
                setIsHoverExpanded(false);
              }
            }
          : undefined
      }
      {...makeAnalyticsAttribute(rest)}
    >
      {searchInput}
    </BaseBox>
  );
};

const TableToolbarSearch = assignWithoutSideEffects(_TableToolbarSearch, {
  displayName: 'TableToolbarSearch',
  componentId: ComponentIds.TableToolbarSearch,
});

const ToolbarWrapper = styled(BaseBox)(({ theme }) => ({
  transition: `background-color ${makeMotionTime(
    getIn(theme.motion, tableToolbar.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableToolbar.backgroundColorMotionEasing)}`,
}));

const _TableToolbar = ({
  children,
  title,
  selectedTitle: controlledSelectedTitle,
}: TableToolbarProps): React.ReactElement => {
  const {
    selectionType,
    selectedRows,
    deselectAllRows,
    tableToolbarPlacement,
  } = useTableRowContext();
  const { currentPaginationState, totalItems } = useTableDataContext();
  const { platform } = useTheme();
  const isSelected = selectedRows && selectedRows.length > 0;

  const defaultTitle = currentPaginationState
    ? `Showing ${currentPaginationState.page * currentPaginationState.size + 1}-${
        currentPaginationState.page * currentPaginationState.size + currentPaginationState.size
      } Items`
    : `Showing 1-${totalItems} Items`;
  const selectedItemsCount = selectedRows ? selectedRows.length : 0;
  const selectedTitle = isSelected
    ? controlledSelectedTitle ??
      `${selectedRows.length} ${selectedItemsCount === 1 ? 'Item' : 'Items'} Selected`
    : null;

  const onMobile = platform === 'onMobile';

  const deselectButton = (
    <Link
      size="small"
      marginLeft={tableToolbar.titleBlockGap}
      variant="button"
      onClick={() => deselectAllRows()}
    >
      Deselect
    </Link>
  );

  return (
    <BaseBox width="100%">
      <ToolbarWrapper
        display="flex"
        width="100%"
        backgroundColor={tableToolbar.backgroundColor}
        padding={tableToolbar.padding}
        flexWrap="wrap"
        flexDirection={onMobile && tableToolbarPlacement === 'inline' ? 'column' : 'row'}
        alignItems="center"
        gap={tableToolbar.titleBlockGap}
        minHeight={makeSize(tableToolbar.minHeight)}
        boxSizing="border-box"
      >
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          <BaseBox>
            <Text
              size="small"
              weight="medium"
              color={isSelected ? 'surface.text.gray.normal' : 'surface.text.gray.subtle'}
            >
              {selectedTitle ?? title ?? defaultTitle}
            </Text>
          </BaseBox>

          {selectionType !== 'none' && isSelected && (
            <BaseBox display="flex" marginLeft={tableToolbar.titleBlockGap} height="spacing.6">
              <Divider orientation="vertical" thickness="thick" />
              {deselectButton}
            </BaseBox>
          )}
        </BaseBox>
        <BaseBox
          display="flex"
          flex={1}
          minWidth={0}
          flexDirection="row"
          flexWrap={onMobile ? 'wrap' : 'nowrap'}
          alignItems="center"
          justifyContent="flex-end"
          gap={tableToolbar.childActionsGap}
        >
          {children}
        </BaseBox>
      </ToolbarWrapper>
    </BaseBox>
  );
};

const TableToolbar = assignWithoutSideEffects(_TableToolbar, {
  displayName: 'TableToolbar',
  componentId: ComponentIds.TableToolbar,
});

export { TableToolbar, TableToolbarActions, TableToolbarSearch };
