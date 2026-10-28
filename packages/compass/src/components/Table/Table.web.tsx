import React, { useCallback, useEffect, useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import { useSort } from '@table-library/react-table-library/sort';
import { usePagination } from '@table-library/react-table-library/pagination';
import {
  SelectClickTypes,
  SelectTypes,
  useRowSelect,
} from '@table-library/react-table-library/select';
import { useTree } from '@table-library/react-table-library/tree';
import styled from 'styled-components';
import usePresence from 'use-presence';
import type { TableDataContextType, TableRowContextType } from './TableContext';
import { TableDataContext, TableRowContext } from './TableContext';
import { ComponentIds } from './componentIds';
import {
  checkboxCellWidth,
  firstColumnStickyZIndex,
  stickyHeaderColumnZIndex,
  refreshWrapperZIndex,
  tableBackgroundColor,
  tablePagination,
  tableRow,
  classes,
} from './tokens';
import type {
  TableProps,
  TableNode,
  TableData,
  Identifier,
  TablePaginationType,
  TableHeaderRowProps,
} from './types';
import { getTableBodyStyles } from './commonStyles';
import { TableSurface } from './TableSurface.web';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwCompassError } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { Skeleton } from '~components/Skeleton';
import { getStyledProps } from '~components/Box/styledProps';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/CompassProvider';
import getIn from '~utils/lodashButBetter/get';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useListViewContext } from '~components/ListView/ListViewContext';

const rowSelectType: Record<
  NonNullable<TableProps<unknown>['selectionType']>,
  SelectTypes | undefined
> = {
  single: SelectTypes.SingleSelect,
  multiple: SelectTypes.MultiSelect,
  none: undefined,
};

// Get the number of TableHeaderCell components.
// This is very complicated but the only way to iterate through the structure and get number of header cells.
// Assuming number of header cells is the same as number of columns
const getTableHeaderCellCount = (children: (data: []) => React.ReactElement): number => {
  const tableRootComponent = children([]);
  if (tableRootComponent && React.isValidElement(tableRootComponent)) {
    const tableComponentArray = React.Children.toArray(tableRootComponent);
    if (React.isValidElement(tableComponentArray[0])) {
      const tableComponentArrayChildren = React.Children.toArray(
        tableComponentArray[0].props.children,
      );
      const tableHeader = tableComponentArrayChildren.find(
        (child) => getComponentId(child) === ComponentIds.TableHeader,
      );
      const tableHeaderChildrenArray = React.isValidElement(tableHeader)
        ? React.Children.toArray(tableHeader.props.children)
        : null;
      const tableHeaderRows = tableHeaderChildrenArray?.filter(
        (child) => getComponentId(child) === ComponentIds.TableHeaderRow,
      );
      const leafTableHeaderRow = tableHeaderRows?.[tableHeaderRows.length - 1];
      const tableHeaderRowChildrenArray = React.isValidElement(leafTableHeaderRow)
        ? React.Children.toArray(leafTableHeaderRow.props.children)
        : null;
      const tableHeaderCells = tableHeaderRowChildrenArray
        ? tableHeaderRowChildrenArray.filter(
            (child) => getComponentId(child) === ComponentIds.TableHeaderCell,
          )
        : null;
      return tableHeaderCells?.length ?? 0;
    }
  }
  return 0;
};

const StyledReactTable = styled(ReactTable)<{
  $styledProps?: {
    height?: BoxProps['height'];
    width?: BoxProps['width'];
    isVirtualized?: boolean;
    isSelectable?: boolean;
    showStripedRows?: boolean;
  };
}>(({ $styledProps }) => {
  const { theme } = useTheme();
  const styledPropsCSSObject = getBaseBoxStyles({
    theme,
    height: $styledProps?.height,
    ...($styledProps?.isVirtualized && {
      width: '100%',
    }),
  });
  const $isSelectable = $styledProps?.isSelectable;
  const $showStripedRows = $styledProps?.showStripedRows;
  return {
    '&&&': {
      ...styledPropsCSSObject,
      overflow: `${$styledProps?.isVirtualized ? 'unset' : 'auto'} !important`,
    },
    ...($styledProps?.isVirtualized
      ? getTableBodyStyles({
          isVirtualized: $styledProps?.isVirtualized,
          theme,
          height: $styledProps?.height,
          width: '100%',
          isSelectable: $isSelectable,
          showStripedRows: $showStripedRows,
        })
      : null),
  };
});

const RefreshWrapper = styled(BaseBox)<{
  isRefreshSpinnerVisible: boolean;
  isRefreshSpinnerEntering: boolean;
  isRefreshSpinnerExiting: boolean;
}>(({ isRefreshSpinnerVisible, isRefreshSpinnerEntering, isRefreshSpinnerExiting, theme }) => {
  return {
    opacity: isRefreshSpinnerVisible ? 1 : 0,
    transition: `opacity ${makeMotionTime(theme.motion.duration.quick)} ${
      isRefreshSpinnerEntering
        ? theme.motion.easing.entrance
        : isRefreshSpinnerExiting
        ? theme.motion.easing.exit
        : ''
    }`,
  };
});

const SKELETON_ROW_COUNT = 7;
const SKELETON_CELL_WIDTHS = {
  first: '70%',
  last: '50%',
  middle: '75%',
  headerFirst: '80%',
  headerRest: '60%',
} as const;

const StyledSkeletonRow = styled(BaseBox)<{ $columns: number; $isHeader?: boolean }>(
  ({ theme, $columns, $isHeader }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${$columns}, minmax(100px, 1fr))`,
    paddingLeft: makeSpace(theme.spacing[4]),
    paddingRight: makeSpace(theme.spacing[4]),
    paddingTop: makeSpace(theme.spacing[$isHeader ? 3 : 4]),
    paddingBottom: makeSpace(theme.spacing[$isHeader ? 3 : 4]),
    borderBottomWidth: makeSpace(theme.border.width.thin),
    borderBottomColor: theme.colors.surface.border.gray.muted,
    borderBottomStyle: 'solid',
    gap: makeSpace(theme.spacing[4]),
    alignItems: 'center',
  }),
);

const _Table = <Item,>({
  children,
  data,
  multiSelectTrigger = 'row',
  selectionType = 'none',
  onSelectionChange,
  isHeaderSticky,
  isFooterSticky,
  isFirstColumnSticky,
  stickyColumnCount: stickyColumnCountProp,
  stickyColumnWidths,
  isLastColumnSticky,
  trailingStickyColumnCount: trailingStickyColumnCountProp,
  trailingStickyColumnWidths,
  rowDensity = 'normal',
  onSortChange,
  sortFunctions,
  toolbar,
  pagination,
  height,
  showStripedRows,
  gridTemplateColumns,
  isLoading = false,
  isRefreshing = false,
  showBorderedCells = false,
  defaultSelectedIds = [],
  backgroundColor = tableBackgroundColor,
  isGrouped = false,
  checkboxDisplay = 'always',
  filterFunctions,
  filterConfig = {},
  columnFilterValues: columnFilterValuesProp,
  defaultColumnFilterValues = {},
  onColumnFilterValuesChange,
  globalFilterValue: globalFilterValueProp,
  defaultGlobalFilterValue = '',
  onGlobalFilterValueChange,
  ...rest
}: TableProps<Item>): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const { isInsideListView } = useListViewContext();

  const [internalGlobalFilterValue, setInternalGlobalFilterValue] = React.useState(
    defaultGlobalFilterValue,
  );
  const globalFilterValue = globalFilterValueProp ?? internalGlobalFilterValue;

  const setGlobalFilterValue = useCallback(
    (value: string): void => {
      if (globalFilterValueProp === undefined) {
        setInternalGlobalFilterValue(value);
      }
      onGlobalFilterValueChange?.(value);
    },
    [globalFilterValueProp, onGlobalFilterValueChange],
  );

  const [internalColumnFilterValues, setInternalColumnFilterValues] = React.useState<
    Record<string, string | string[]>
  >(defaultColumnFilterValues);
  const columnFilterValues = columnFilterValuesProp ?? internalColumnFilterValues;

  const setColumnFilterValue = useCallback(
    (key: string, value: string | string[]): void => {
      const nextValues = { ...columnFilterValues, [key]: value };
      if (columnFilterValuesProp === undefined) {
        setInternalColumnFilterValues(nextValues);
      }
      onColumnFilterValuesChange?.(nextValues);
    },
    [columnFilterValues, columnFilterValuesProp, onColumnFilterValuesChange],
  );

  const filterableColumns = useMemo(() => Object.keys(filterFunctions ?? {}), [filterFunctions]);

  const activeColumnFilters = useMemo(
    () =>
      Object.entries(columnFilterValues).filter(([, value]) =>
        Array.isArray(value) ? value.length > 0 : Boolean(value),
      ),
    [columnFilterValues],
  );

  const applyFilters = useCallback(
    (nodesToFilter: TableNode<Item>[]): TableNode<Item>[] => {
      if (!filterFunctions || (activeColumnFilters.length === 0 && !globalFilterValue)) {
        return nodesToFilter;
      }
      return nodesToFilter
        .filter((node) => {
          const passesColumnFilters = activeColumnFilters.every(([key, value]) => {
            const filterFn = filterFunctions[key];
            return filterFn ? filterFn(node, value) : true;
          });
          if (!passesColumnFilters) return false;
          if (!globalFilterValue) return true;
          return Object.values(filterFunctions).some((filterFn) =>
            filterFn(node, globalFilterValue),
          );
        })
        .map((node) => {
          const nodeWithChildren = node as TableNode<Item> & { nodes?: TableNode<Item>[] };
          return Array.isArray(nodeWithChildren.nodes)
            ? { ...node, nodes: applyFilters(nodeWithChildren.nodes) }
            : node;
        });
    },
    [filterFunctions, activeColumnFilters, globalFilterValue],
  );

  const filteredData: TableData<Item> = useMemo(
    () =>
      activeColumnFilters.length > 0 || globalFilterValue
        ? { nodes: applyFilters(data.nodes) }
        : data,
    [data, applyFilters, activeColumnFilters, globalFilterValue],
  );

  const [selectedRows, setSelectedRows] = React.useState<TableNode<unknown>['id'][]>(
    selectionType !== 'none' ? defaultSelectedIds : [],
  );
  const [disabledRows, setDisabledRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);
  const [paginationType, setPaginationType] = React.useState<NonNullable<TablePaginationType>>(
    'client',
  );
  const [headerRowDensity, setHeaderRowDensity] = React.useState<TableHeaderRowProps['rowDensity']>(
    undefined,
  );
  const [hasHoverActions, setHasHoverActions] = React.useState(false);
  const tableRootComponent = children([]);
  const isVirtualized = getComponentId(tableRootComponent) === ComponentIds.VirtualizedTable;

  const isMobile = useIsMobile();
  const lastHoverActionsColWidth = isMobile ? '1fr' : '0px';

  const requestedStickyColumnCount = stickyColumnCountProp ?? (isFirstColumnSticky ? 1 : 0);
  const requestedTrailingStickyColumnCount =
    trailingStickyColumnCountProp ?? (isLastColumnSticky ? 1 : 0);

  if (__DEV__) {
    if (
      requestedStickyColumnCount > 1 &&
      (!stickyColumnWidths || stickyColumnWidths.length < requestedStickyColumnCount)
    ) {
      throwCompassError({
        message:
          '`stickyColumnWidths` must provide a pixel width for each of the `stickyColumnCount` columns when freezing more than one column.',
        moduleName: 'Table',
      });
    }
    if (
      requestedTrailingStickyColumnCount > 1 &&
      (!trailingStickyColumnWidths ||
        trailingStickyColumnWidths.length < requestedTrailingStickyColumnCount)
    ) {
      throwCompassError({
        message:
          '`trailingStickyColumnWidths` must provide a pixel width for each of the `trailingStickyColumnCount` columns when freezing more than one column.',
        moduleName: 'Table',
      });
    }
  }

  const stickyColumnCount = isMobile ? 0 : requestedStickyColumnCount;
  const trailingStickyColumnCount = isMobile ? 0 : requestedTrailingStickyColumnCount;

  const shouldHeaderBeSticky =
    isVirtualized || isHeaderSticky || stickyColumnCount > 0 || trailingStickyColumnCount > 0;

  const {
    isEntering: isRefreshSpinnerEntering,
    isMounted: isRefreshSpinnerMounted,
    isExiting: isRefreshSpinnerExiting,
    isVisible: isRefreshSpinnerVisible,
  } = usePresence(isRefreshing, {
    transitionDuration: theme.motion.duration.quick,
  });

  const columnCount = getTableHeaderCellCount(children);

  const getStickyColumnsCSS = useCallback(
    (zIndex: number): string => {
      if (stickyColumnCount < 1 && trailingStickyColumnCount < 1) return '';

      const isMultiSelect = selectionType === 'multiple';
      const lastStickyBoxShadow = showBorderedCells
        ? `box-shadow: 1px 0 0 0 ${getIn(theme.colors, tableRow.borderColor)} !important;`
        : '';
      const stickyRule = (domIndex: number, left: number, isLastSticky: boolean): string => `
  &:nth-of-type(${domIndex}) {
    left: ${left}px !important;
    position: sticky !important;
    z-index: ${zIndex} !important;
    ${isLastSticky ? lastStickyBoxShadow : ''}
  }
  &:nth-of-type(${domIndex}).${classes.HAS_ROW_SPANNING} {
    z-index: ${zIndex + 1} !important;
  }`;

      const rules: string[] = [];
      let cumulativeLeft = 0;
      if (isMultiSelect && stickyColumnCount > 0) {
        rules.push(stickyRule(1, 0, false));
        cumulativeLeft = checkboxCellWidth;
      }
      for (let i = 0; i < stickyColumnCount; i += 1) {
        const domIndex = i + 1 + (isMultiSelect ? 1 : 0);
        rules.push(stickyRule(domIndex, cumulativeLeft, i === stickyColumnCount - 1));
        cumulativeLeft += Number.parseFloat(stickyColumnWidths?.[i] ?? '0');
      }

      if (trailingStickyColumnCount > 0) {
        const trailingStickyRule = (
          domIndexFromEnd: number,
          right: number,
          isFirstTrailingSticky: boolean,
        ): string => `
  &:nth-last-of-type(${domIndexFromEnd}) {
    right: ${right}px !important;
    position: sticky !important;
    z-index: ${zIndex} !important;
    ${isFirstTrailingSticky ? lastStickyBoxShadow : ''}
  }
  &:nth-last-of-type(${domIndexFromEnd}).${classes.HAS_ROW_SPANNING} {
    z-index: ${zIndex + 1} !important;
  }`;

        const trailingDomOffset = hasHoverActions ? 1 : 0;
        let cumulativeRight = 0;
        for (let i = 0; i < trailingStickyColumnCount; i += 1) {
          const domIndexFromEnd = i + 1 + trailingDomOffset;
          rules.push(trailingStickyRule(domIndexFromEnd, cumulativeRight, i === 0));
          cumulativeRight += Number.parseFloat(trailingStickyColumnWidths?.[i] ?? '0');
        }
      }

      return rules.join('\n');
    },
    [
      stickyColumnCount,
      trailingStickyColumnCount,
      selectionType,
      stickyColumnWidths,
      trailingStickyColumnWidths,
      hasHoverActions,
      showBorderedCells,
      theme,
    ],
  );
  const stickyColumnsCSS = useMemo(() => getStickyColumnsCSS(firstColumnStickyZIndex), [
    getStickyColumnsCSS,
  ]);
  const stickyHeaderColumnsCSS = useMemo(() => getStickyColumnsCSS(stickyHeaderColumnZIndex), [
    getStickyColumnsCSS,
  ]);

  const tableTheme = useTableTheme({
    Table: `
    height:${isFooterSticky ? `100%` : undefined};
    ${
      toolbar && !isInsideListView
        ? `border-top: ${makeBorderSize(theme.border.width.thin)} solid ${
            theme.colors.surface.border.gray.muted
          };`
        : ''
    }
    ${
      pagination
        ? `border-bottom: ${makeBorderSize(theme.border.width.thin)} solid ${
            theme.colors.surface.border.gray.muted
          };`
        : ''
    }
    --data-table-library_grid-template-columns: ${
      gridTemplateColumns
        ? `${selectionType === 'multiple' ? 'min-content' : ''} ${gridTemplateColumns} ${
            hasHoverActions ? lastHoverActionsColWidth : ''
          }`
        : ` ${
            selectionType === 'multiple' ? 'min-content' : ''
          } repeat(${columnCount},minmax(100px, 1fr)) ${
            hasHoverActions ? lastHoverActionsColWidth : ''
          }`
    } !important;
    background-color: ${getIn(theme.colors, backgroundColor)};
    isolation: isolate;
    `,
    HeaderCell: `
    position: ${shouldHeaderBeSticky ? 'sticky' : 'relative'};
    top: ${shouldHeaderBeSticky ? '0' : undefined};
    ${stickyHeaderColumnsCSS}
    `,
    Cell: `
    ${stickyColumnsCSS}
    `,
    FooterCell: `
    position: ${isFooterSticky ? 'sticky' : 'relative'};
    bottom: ${isFooterSticky ? '0' : undefined};
    ${stickyColumnsCSS}
    `,
  });

  useEffect(() => {
    setTotalItems(filteredData.nodes.length);
  }, [filteredData.nodes]);

  // Selection Logic
  const onSelectChange: MiddlewareFunction = (_, state): void => {
    const selectedIds: Identifier[] = state.id ? [state.id] : state.ids ?? [];
    setSelectedRows(selectedIds);
    onSelectionChange?.({
      selectedIds,
      values: data.nodes.filter((node) => selectedIds.includes(node.id)),
    });
  };

  const rowSelectConfig = useRowSelect(
    data,
    {
      onChange: onSelectChange,
      state: {
        ...(selectionType === 'multiple'
          ? { ids: selectedRows }
          : selectionType === 'single'
          ? { id: selectedRows[0] }
          : {}),
      },
    },
    {
      clickType:
        multiSelectTrigger === 'row' ? SelectClickTypes.RowClick : SelectClickTypes.ButtonClick,
      rowSelect: selectionType !== 'none' ? rowSelectType[selectionType] : undefined,
    },
  );

  const toggleRowSelectionById = useMemo(
    () => (id: Identifier): void => {
      // Use recursive selection only for grouped tables with multiple selection
      if (selectionType === 'multiple' && isGrouped) {
        rowSelectConfig.fns.onToggleByIdRecursively(id, {
          // When clicking partially selected parent, select all children
          isPartialToAll: true,
        });
      } else {
        rowSelectConfig.fns.onToggleById(id);
      }
    },
    [rowSelectConfig.fns],
  );

  const deselectAllRows = useMemo(
    () => (): void => {
      rowSelectConfig.fns.onRemoveAll();
    },
    [rowSelectConfig.fns],
  );

  const toggleAllRowsSelection = useMemo(
    () => (): void => {
      if (isGrouped) {
        if (selectedRows.length > 0) {
          rowSelectConfig.fns.onRemoveAll();
        } else {
          rowSelectConfig.fns.onToggleAll({});
        }
        return;
      }

      const visibleSelectableIds = filteredData.nodes
        .map((item: TableNode<Item>) => (disabledRows.includes(item.id) ? null : item.id))
        .filter(Boolean) as Identifier[];
      const isAllVisibleSelected =
        visibleSelectableIds.length > 0 &&
        visibleSelectableIds.every((id) => selectedRows.includes(id));

      if (isAllVisibleSelected) {
        rowSelectConfig.fns.onRemoveByIds(visibleSelectableIds);
      } else {
        const idsToAdd = visibleSelectableIds.filter((id) => !selectedRows.includes(id));
        rowSelectConfig.fns.onAddByIds(idsToAdd, {});
      }
    },
    [rowSelectConfig.fns, filteredData.nodes, selectedRows, disabledRows, isGrouped],
  );

  const tree = useTree(
    isGrouped ? data : { nodes: [] },
    {},
    {
      // Disable row click expand/collapse (fallback enables unwanted expand/collapse on row click)
      clickType: undefined,
      // Disable all indentation for flat appearance
      treeYLevel: undefined,
    },
  );

  useIsomorphicLayoutEffect(() => {
    if (isGrouped && tree?.fns.onToggleAll) {
      tree.fns.onToggleAll({ ids: [] });
    }
  }, []);

  // Sort Logic
  const handleSortChange: MiddlewareFunction = (_, state) => {
    onSortChange?.({
      sortKey: state.sortKey,
      isSortReversed: state.reverse,
    });
  };

  const sort = useSort(
    filteredData,
    {
      onChange: handleSortChange,
    },
    {
      // @ts-expect-error ignore this, if sortFunctions is undefined, it will be ignored
      sortFns: sortFunctions,
    },
  );

  const currentSortedState: TableDataContextType<Item>['currentSortedState'] = useMemo(() => {
    const sortKey = sort.state.sortKey;
    const hasSort = Boolean(sortKey && sortKey !== 'NONE');
    return {
      sortKey: hasSort ? sortKey : '',
      isSortReversed: sort.state.reverse,
      sortableColumns: Object.keys(sortFunctions ?? {}),
      sortOrder: hasSort
        ? [{ sortKey, direction: sort.state.reverse ? ('desc' as const) : ('asc' as const) }]
        : [],
    };
  }, [sort.state, sortFunctions]);

  const toggleSort = useCallback(
    (sortKey: string, _isMultiSort?: boolean): void => {
      sort.fns.onToggleSort({
        sortKey,
      });
    },
    [sort.fns],
  );

  // Pagination

  const hasPagination = Boolean(pagination);

  // Extract defaultPageSize from TablePagination child props
  const paginationDefaultPageSize =
    React.isValidElement(pagination) && getComponentId(pagination) === ComponentIds.TablePagination
      ? (pagination.props as { defaultPageSize?: number }).defaultPageSize
      : undefined;

  const paginationConfig = usePagination(
    filteredData,
    {
      state: {
        page: 0,
        size: paginationDefaultPageSize ?? tablePagination.defaultPageSize,
      },
    },
    {
      isServer: paginationType === 'server',
    },
  );

  const currentPaginationState = useMemo(() => {
    return hasPagination
      ? {
          page: paginationConfig.state.page,
          size: paginationConfig.state.size,
        }
      : undefined;
  }, [paginationConfig.state, hasPagination]);

  const setPaginationPage = useCallback(
    (page: number): void => {
      paginationConfig.fns.onSetPage(page);
    },
    [paginationConfig.fns],
  );

  const setPaginationRowSize = useCallback(
    (size: number): void => {
      paginationConfig.fns.onSetSize(size);
    },
    [paginationConfig.fns],
  );

  // Toolbar Component
  if (__DEV__) {
    if (toolbar && !isValidAllowedChildren(toolbar, ComponentIds.TableToolbar)) {
      throwCompassError({
        message: 'Only TableToolbar component is allowed in the `toolbar` prop',
        moduleName: 'Table',
      });
    }
  }

  const tableRowContext: TableRowContextType = useMemo(
    () => ({
      selectionType,
      selectedRows,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      rowDensity,
      showStripedRows,
      disabledRows,
      setDisabledRows,
      backgroundColor,
      headerRowDensity,
      setHeaderRowDensity,
      showBorderedCells,
      shouldHeaderBeSticky,
      hasHoverActions,
      setHasHoverActions,
      multiSelectTrigger,
      columnCount,
      gridTemplateColumns,
      isVirtualized,
      isGrouped,
      expandedRowIds: [],
      toggleRowExpansionById: () => {},
      tableToolbarPlacement: toolbar?.props?.placement ?? 'inline',
      checkboxDisplay,
    }),
    [
      selectionType,
      selectedRows,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      gridTemplateColumns,
      rowDensity,
      columnCount,
      showStripedRows,
      disabledRows,
      setDisabledRows,
      backgroundColor,
      headerRowDensity,
      setHeaderRowDensity,
      showBorderedCells,
      shouldHeaderBeSticky,
      hasHoverActions,
      setHasHoverActions,
      multiSelectTrigger,
      isVirtualized,
      isGrouped,
      toolbar?.props?.placement,
      checkboxDisplay,
    ],
  );

  const tableDataContext: TableDataContextType<Item> = useMemo(
    () => ({
      totalItems,
      toggleSort,
      currentSortedState,
      setPaginationPage,
      setPaginationRowSize,
      currentPaginationState,
      paginationType,
      setPaginationType,
      tableData: filteredData.nodes,
      globalFilterValue,
      setGlobalFilterValue,
      columnFilterValues,
      setColumnFilterValue,
      filterableColumns,
      filterConfig,
    }),
    [
      totalItems,
      toggleSort,
      currentSortedState,
      setPaginationPage,
      setPaginationRowSize,
      currentPaginationState,
      paginationType,
      setPaginationType,
      filteredData.nodes,
      globalFilterValue,
      setGlobalFilterValue,
      columnFilterValues,
      setColumnFilterValue,
      filterableColumns,
      filterConfig,
    ],
  );

  return (
    <TableRowContext.Provider value={tableRowContext}>
      <TableDataContext.Provider value={tableDataContext}>
      <TableSurface
        colorScheme={colorScheme}
        borderRadius={isInsideListView ? 'none' : 'medium'}
        overflow="hidden"
        isInsideListView={isInsideListView ?? false}
        // Transparent when inside ListView so the gradient pseudo-elements
        // on ListViewSurface remain visible through the TableSurface.
        backgroundColor={isInsideListView ? 'transparent' : 'surface.background.gray.intense'}
      >
        {isLoading ? (
          <BaseBox
            flex={1}
            {...getStyledProps(rest)}
            {...metaAttribute({ name: MetaConstants.Table })}
            {...makeAnalyticsAttribute(rest)}
            testID="table-skeleton"
          >
            {/* Header skeleton row */}
            <StyledSkeletonRow $columns={columnCount || 5} $isHeader>
              {Array.from({ length: columnCount || 5 }).map((_, i) => (
                <Skeleton
                  // AUDIT: key={index} — confirmed static list, safe (verify if list becomes dynamic)
                  key={i}
                  width={
                    i === 0 ? SKELETON_CELL_WIDTHS.headerFirst : SKELETON_CELL_WIDTHS.headerRest
                  }
                  height="16px"
                  borderRadius="medium"
                />
              ))}
            </StyledSkeletonRow>
            {/* Body skeleton rows */}
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIdx) => (
              <StyledSkeletonRow key={rowIdx} $columns={columnCount || 5}>
                {Array.from({ length: columnCount || 5 }).map((_, colIdx) => {
                  const cols = columnCount || 5;
                  const width =
                    colIdx === 0
                      ? SKELETON_CELL_WIDTHS.first
                      : colIdx === cols - 1
                      ? SKELETON_CELL_WIDTHS.last
                      : SKELETON_CELL_WIDTHS.middle;
                  return (
                    <Skeleton key={colIdx} width={width} height="14px" borderRadius="medium" />
                  );
                })}
              </StyledSkeletonRow>
            ))}
          </BaseBox>
        ) : (
          <BaseBox
            flex={1}
            position="relative"
            {...getStyledProps(rest)}
            {...metaAttribute({ name: MetaConstants.Table })}
            width={isVirtualized ? `100%` : undefined}
            {...makeAnalyticsAttribute(rest)}
          >
            {isRefreshSpinnerMounted && (
              <RefreshWrapper
                position="absolute"
                width="100%"
                height="100%"
                zIndex={refreshWrapperZIndex}
                backgroundColor="overlay.background.subtle"
                justifyContent="center"
                alignItems="center"
                display="flex"
                isRefreshSpinnerEntering={isRefreshSpinnerEntering}
                isRefreshSpinnerExiting={isRefreshSpinnerExiting}
                isRefreshSpinnerVisible={isRefreshSpinnerVisible}
              >
                <Spinner color="white" accessibilityLabel="Refreshing Table" size="large" />
              </RefreshWrapper>
            )}
            {/* wrapping toolbar in BaseBox and passing the same analytics attributes as of table because in analytics POV, events triggered are from table */}
            <BaseBox {...makeAnalyticsAttribute(rest)}>{toolbar}</BaseBox>
            <StyledReactTable
              role="table"
              layout={{ fixedHeader: shouldHeaderBeSticky, horizontalScroll: true }}
              data={filteredData}
              // @ts-expect-error ignore this, theme clashes with styled-component's theme. We're using useTheme from blade to get actual theme
              theme={tableTheme}
              select={selectionType !== 'none' ? rowSelectConfig : null}
              sort={sortFunctions ? sort : null}
              tree={isGrouped ? tree : null}
              $styledProps={{
                height,
                width: isVirtualized ? `100%` : undefined,
                isVirtualized,
                isSelectable: selectionType !== 'none',
                showStripedRows,
              }}
              pagination={hasPagination ? paginationConfig : null}
              {...makeAccessible({ multiSelectable: selectionType === 'multiple' })}
              {...metaAttribute({ name: MetaConstants.Table })}
              {...makeAnalyticsAttribute(rest)}
            >
              {children}
            </StyledReactTable>
            {pagination}
          </BaseBox>
        )}
      </TableSurface>
      </TableDataContext.Provider>
    </TableRowContext.Provider>
  );
};
const Table = assignWithoutSideEffects(_Table, {
  componentId: ComponentIds.Table,
});

export { Table };
